import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { polarClient } from "@/module/payment/config/polar";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { polarCustomerId: null },
  });

  for (const user of users) {
    const customer = await polarClient.customers.create({
      email: user.email!,
      name: user.name || undefined,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { polarCustomerId: customer.id },
    });

    console.log("Created Polar customer for:", user.email);
  }

  return NextResponse.json({ success: true });
}