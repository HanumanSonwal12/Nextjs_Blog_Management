import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import blog from "@/models/blog";
import user from "@/models/User";

const getBlogsWithSEO = async (filter) => {
  const blogs = await blog
    .find(filter, { __v: 0 })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "name email",
    });

  return blogs.map((b) => ({
    ...b.toObject(),
    seo: {
      seoTitle: b.seoTitle,
      metaKeywords: b.metaKeywords,
      excerpt: b.excerpt,
    },
  }));
};

export async function GET(req) {
  try {
    await connectDB();

    let token = null;

    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) {
        token = cookieToken.value;
      }
    }

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        const allBlogs = await getBlogsWithSEO({});
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Logged in user: All blogs (published + draft)",
          blogs: allBlogs,
        });
      } catch (err) {
        const publicBlogs = await getBlogsWithSEO({ status: "published" });
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Token invalid or expired: Only published blogs",
          blogs: publicBlogs,
        });
      }
    }

    const publicBlogs = await getBlogsWithSEO({ status: "published" });
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Public: Only published blogs",
      blogs: publicBlogs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
