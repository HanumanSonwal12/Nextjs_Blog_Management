import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Blog from "@/models/blog";
import connectDB from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();

    let token;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) {
        token = cookieToken.value;
      }
    }

    const populateFields = {
      path: "author",       
      select: "name email", 
    };

    const projection = {
      __v: 0, 
    };

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const allBlogs = await Blog.find({}, projection)
          .sort({ createdAt: -1 })
          .populate(populateFields);

        const blogsWithSeo = allBlogs.map((blog) => ({
          ...blog.toObject(),
          seo: {
            seoTitle: blog.seoTitle,
            metaKeywords: blog.metaKeywords,
            excerpt: blog.excerpt,
          },
        }));

        return NextResponse.json({
          status: 200,
          success: true,
          message: "Logged in user: All blogs (published + draft)",
          blogs: blogsWithSeo,
        });
      } catch (err) {
        const publicBlogs = await Blog.find({ status: "published" }, projection)
          .sort({ createdAt: -1 })
          .populate(populateFields);

        const blogsWithSeo = publicBlogs.map((blog) => ({
          ...blog.toObject(),
          seo: {
            seoTitle: blog.seoTitle,
            metaKeywords: blog.metaKeywords,
            excerpt: blog.excerpt,
          },
        }));

        return NextResponse.json({
          status: 200,
          success: true,
          message: "Token invalid or expired: Only published blogs",
          blogs: blogsWithSeo,
        });
      }
    } else {
      const publicBlogs = await Blog.find({ status: "published" }, projection)
        .sort({ createdAt: -1 })
        .populate(populateFields);

      const blogsWithSeo = publicBlogs.map((blog) => ({
        ...blog.toObject(),
        seo: {
          seoTitle: blog.seoTitle,
          metaKeywords: blog.metaKeywords,
          excerpt: blog.excerpt,
        },
      }));

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Public: Only published blogs",
        blogs: blogsWithSeo,
      });
    }
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
