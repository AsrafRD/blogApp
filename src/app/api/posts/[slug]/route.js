import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

//GET SINGLE PAGE
export const GET = async (req, { params }) => {
  const { slug } = params;
  try {
    // Cari post berdasarkan slug
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      // Jika post tidak ditemukan, kirim respons dengan status 404
      return new NextResponse(JSON.stringify({ message: "Post not found" }, { status: 404 }));
    }

    // Jika post ditemukan, tambahkan satu ke views
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: { views: post.views + 1 },
      include: { user: true },
    });

    // Kirim respons dengan post yang sudah diperbarui dan status 200
    return new NextResponse(JSON.stringify(updatedPost, { status: 200 }));
  } catch (err) {
    // Tangani kesalahan dengan mengirim respons dengan status 500
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }, { status: 500 }));
  }
};

export const PATCH = async (req, { params }) => {
  const session = await getAuthSession();

  if (!params || !params.slug) {
    return new NextResponse(
      JSON.stringify({ message: "Missing slug parameter" }),
      { status: 400 }
    );
  }

  const { slug } = params;
  const body = await req.json();

  console.log("slug nya:", slug);
  console.log("body nya:", body);

  if (!params || !params.slug) {
    return new NextResponse(
      JSON.stringify({ message: "Missing slug parameter" }),
      { status: 400 }
    );
  }

  console.log("paramas nya ni", params)

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authenticated!" }), {
      status: 401,
    });
  }

  if (req.method === "PATCH") {
    try {

      if (!slug || !body) {
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
        data: body,
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


// DELETE A POST
export const DELETE = async (req, { params }) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  // Pastikan metode permintaan adalah DELETE
  if (req.method === "DELETE") {
    try {
      // Ambil slug postingan dari parameter permintaan
      const { slug } = params;

      // Cari postingan dengan slug yang diberikan
      const post = await prisma.post.findUnique({ where: { slug } });

      // Jika postingan tidak ditemukan, kirim respons dengan status 404
      if (!post) {
        return new NextResponse(
          JSON.stringify({ message: "Post not found" }, { status: 404 })
        );
      }

      // Verifikasi apakah pengguna yang sedang login adalah pemilik postingan
      if (post.userEmail !== session.user.email) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized action" }, { status: 403 })
        );
      }

      // Hapus semua komentar yang terkait dengan postingan ini
      await prisma.comment.deleteMany({ where: { postSlug: post.slug } });

      // Setelah itu, baru hapus postingan dari database
      await prisma.post.delete({ where: { slug } });

      // Kirim respons sukses dengan status 204 No Content
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error(error);
      // Tangani kesalahan dan kirim respons dengan status 500
      return new NextResponse(
        JSON.stringify({ message: "Failed to delete post" }, { status: 500 })
      );
    }
  } else {
    // Jika metode permintaan bukan DELETE, kirim respons dengan status 405 Method Not Allowed
    return new NextResponse(null, { status: 405 });
  }
}
