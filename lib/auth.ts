import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db"
import {polar,checkout,portal,usage,webhooks} from "@polar-sh/better-auth";
import { polarClient } from "@/module/payment/config/polar";
import { updatePolarCustomerId, updateUserTier } from "@/module/payment/lib/subscription";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders:{
        github:{
            clientId:process.env.GITHUB_CLIENT_ID!,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
            scope: ["repo", "user:email"],
        }
    },
     events: {
    async onSignIn({ user }:{user:any}) {
      if (!user.polarCustomerId) {
        console.log("Creating Polar customer on login...");

        const customer = await polarClient.customers.create({
          email: user.email!,
          name: user.name || undefined,
        });

        await updatePolarCustomerId(user.id, customer.id);
      }
    },
  },

    trustedOrigins:["https://steve-guard-code-reviewer.vercel.app","https://steve-guard-code-reviewer.vercel.app/"], //"http://localhost:3000" if run locally
    plugins:[
        polar({
          client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                           productId: process.env.POLAR_PRODUCT_ID!,
                            slug: "SteveGuard-AI-Github-Code-Reviewer" // Custom slug for easy reference in Checkout URL, e.g. /checkout/steve-guard-new-dev
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL||"/dashboard/subscription?success=true",
                    authenticatedUsersOnly: true
                }),
                portal({
                    returnUrl: process.env.NEXT_PUBLIC_APP_BASE_URL|| "http://localhost:3000/dashboard"
                }),
                usage(),
                webhooks({
                    secret:process.env.POLAR_WEBHOOK_SECRET!,
                    onSubscriptionActive:async(payload)=>{
                        const customerId=payload.data.customerId;

                        const user =await prisma.user.findUnique({
                            where:{
                                polarCustomerId:customerId
                            }
                        });
                        if(user){
                            await updateUserTier(user.id,"PRO","ACTIVE",payload.data.id);
                        }
                    },
                    onSubscriptionCanceled:async(payload)=>{
                        const customerId=payload.data.customerId;

                        const user =await prisma.user.findUnique({
                            where:{
                                polarCustomerId:customerId
                            }
                        });
                        if(user){
                            await updateUserTier(user.id,user.subscriptionTier as any, "CANCELED");
                        }
                    },
                    onSubscriptionRevoked:async(payload)=>{
                         const customerId=payload.data.customerId;

                        const user =await prisma.user.findUnique({
                            where:{
                                polarCustomerId:customerId
                            }
                        });
                        if(user){
                            await updateUserTier(user.id,"FREE", "EXPIRED");
                        }
                    },
                    onOrderPaid:async()=>{

                    },
                    onCustomerCreated:async(payload)=>{
                        const user=await prisma.user.findUnique({
                            where:{
                                email:payload.data.email
                            }
                        });
                        if(user){
                            await updatePolarCustomerId(user.id,payload.data.id)
                        }
                    }
                })
            ],
        })
    ]
});