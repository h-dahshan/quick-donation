import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalDonations = await prisma.donations.aggregate({
      _sum: {
        donation: true,
      },
      where: {
        paid: true,
      },
    });
    const response = { totalDonations: totalDonations._sum.donation };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new NextResponse(error, { status: 500 });
  }
}
