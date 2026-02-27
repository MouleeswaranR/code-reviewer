import { reviewPullRequest } from "@/module/ai/actions";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest){
    try {
        const body=await req.json();
        const event=req.headers.get("x-github-event");

        if(event==="ping"){
            return NextResponse.json({message:"Pong"},{status:200})
        }

        if(event==="pull_request"){
            const action=body.action;
            const repo=body.repository.full_name;
            const prNumber=body.number;
            console.log("Action: ",action);
            
            const [owner,repoName]=repo.split("/");
            
             const validActions = [
                    "opened",
                    "synchronize",
                    "reopened",
                    "ready_for_review"
                ];
                
            if(validActions.includes(action)){
                try {
                 await reviewPullRequest(owner, repoName, prNumber);
                console.log(`Review Completed for ${repoName} #${prNumber}`);
                } catch (error) {
                 console.error(`Error reviewing ${repoName} #${prNumber}`, error);
                }
            }
        }

        return NextResponse.json({message:"Event Processes"},{status:200})
    } catch (error) {
        console.error("Error Processing Webhook:",error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
        
    }
}