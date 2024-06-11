import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const latestPost = await prisma.post.findFirst({
      orderBy: { createdAt: "desc" }, // Urutkan berdasarkan waktu dibuat secara descending
    });
    return new NextResponse(
      JSON.stringify(latestPost),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
