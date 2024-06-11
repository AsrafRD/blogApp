import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// PATCH (Update) A POST
export const PATCH = async (req, { params }) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }), 
      { status: 401 }
    );
  }

  try {
    const { slug } = params; // Use slug instead of id
    const body = await req.json();

    const post = await prisma.post.findUnique({
      where: { slug }, // Find by slug
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found" }), 
        { status: 404 }
      );
    }

    if (post.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized action" }), 
        { status: 403 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { slug }, // Update by slug
      data: body,
    });

    return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), 
      { status: 500 }
    );
  }
};