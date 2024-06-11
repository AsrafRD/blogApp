import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const post = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

export const PATCH = async (req) => {
  const session = await getAuthSession();
  const body = await req.json();
  const slug = body.dataSlug;

  console.log("slug nya:", slug);
  console.log("body nya:", body);

  if (!slug) {
    return new NextResponse(
      JSON.stringify({ message: "Missing slug parameter" }),
      { status: 400 }
    );
  }

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), {
      status: 401,
    });
  }

  if (req.method === "PATCH") {
    try {
      const { dataSlug, ...postData } = body; // Mengeluarkan dataSlug dari body

      if (!postData) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid request data" }),
          { status: 400 }
        );
      }

      const post = await prisma.post.findUnique({
        where: { slug },
      });

      if (!post) {
        return new NextResponse(JSON.stringify({ message: "Post not found" }), {
          status: 404,
        });
      }

      if (post.userEmail !== session.user.email) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized action" }),
          { status: 403 }
        );
      }

      const updatedPost = await prisma.post.update({
        where: { slug },
        data: { ...postData, slug }, // Gunakan nilai dataSlug sebagai slug baru
      });

      return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
    } catch (err) {
      console.log("Error updating post:", err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }

  return new NextResponse(
    JSON.stringify({ message: "Method not allowed" }),
    { status: 405 }
  );
};
