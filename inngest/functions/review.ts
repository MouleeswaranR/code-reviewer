import { inngest } from "../client";

import { getPullRequestDiff, postReviewComment } from "@/module/github/lib/github";
import { retrieveContext } from "@/module/ai/lib/rag";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { success } from "zod";


export const generateReview=inngest.createFunction(
    {id:"generate-review",concurrency:5},
    {event:"pr.review.requested"},
    async({event,step})=>{
        const{owner,repo,prNumber,userId}=event.data;

        const {diff,title,description,token}=await step.run("fetch-pr-data",async()=>{
            const account=await prisma.account.findFirst({
                where:{
                    userId:userId,
                    providerId:"github"
                }
            })
            console.log("Account: ",account);
            if(!account?.accessToken){
                throw new Error("No Github access token found");
            }

            const data=await getPullRequestDiff(account.accessToken,owner,repo,prNumber);
            return {...data,token:account.accessToken};
        })

        const context=await step.run("retrieve-context",async()=>{
            const query=`${title}\n${description}`;
            return await retrieveContext(query,`${owner}/${repo}`)
        })

        const review = await step.run("generate-ai-review", async () => {
        const prompt = `
        You are a senior software engineer performing a professional GitHub pull request review.

        Write feedback like a real automated reviewer (similar to CodeRabbit).

        Rules:
        - Be concise and professional.
        - Use bullet points.
        - Avoid long essays.
        - Do NOT restate the entire diff.
        - Keep total output under 400 words.
        - If no major issues, say so clearly.
        - Generate a Mermaid diagram ONLY if the change affects logic flow.
        - Keep Mermaid syntax very simple.
        - Do NOT use quotes, parentheses, braces, or special characters inside diagram labels.
        - Use short node names.
        - If no logical flow change exists, state "No flow change detected" instead of diagram.

        PR Title: ${title}
        PR Description: ${description || "No description provided"}

         Context from Codebase:
        ${context.join("\n\n")}

        Code Changes:
        \`\`\`diff
        ${diff}
        \`\`\`

        Respond exactly in this structure:

        ### 🔎 Overview
        Short 2-3 sentence explanation.

        ### 🧭 Change Flow
        If applicable, include:

        \`\`\`mermaid
        sequenceDiagram
            User->>App: Request
            App->>Service: Process
            Service-->>App: Response
            App-->>User: Result
        \`\`\`

        If no flow change, write:
        No flow change detected.

        ### ✅ What Looks Good
        - Bullet points

        ### ⚠️ Suggestions
        - Bullet points

        ### 📌 Verdict
        Approve / Minor suggestions / Needs clarification

        Keep it clean and production-ready.
        `;

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt
        });

        return text;
        });
        await step.run("post-comment",async()=>{
            await postReviewComment(token, owner,repo,prNumber,review);
        });

        await step.run("save-review",async()=>{
            const repository=await prisma.repository.findFirst({
                where:{
                    owner,
                    name:repo,
                }
            })
            if(repository){
                await prisma.review.create({
                    data:{
                        repositoryId:repository.id,
                        prNumber,
                        prTitle:title,
                        prUrl:`https://github.com/${owner}/${repo}/pull/${prNumber}`,
                        review,
                        status:"completed"
                    },
                });
            }
        })
        return {success:true}
    }
)