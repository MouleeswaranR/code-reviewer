import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { polarClient } from "@/module/payment/config/polar";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { polarCustomerId: null },
    });

    for (const user of users) {
      console.log("Fetching Polar customer for:", user.email);

      // 🔥 Direct API call using fetch (bypass SDK complexity)
      const response = await fetch(
        `https://api.polar.sh/v1/customers/?email=${encodeURIComponent(
          user.email!
        )}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const customerId = data.items[0].id;

        await prisma.user.update({
          where: { id: user.id },
          data: { polarCustomerId: customerId },
        });

        console.log("Linked:", customerId);
      } else {
        console.log("No Polar customer found for:", user.email);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FIX ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}