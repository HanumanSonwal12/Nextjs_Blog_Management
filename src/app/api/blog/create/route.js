import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Please login first. Token not found.",
        },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 403 }
      );
    }

    const existingUser = await User.findById(decoded.userId);
    if (!existingUser) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Invalid user. Please login again.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      image,
      tags,
      categories,
      status,
      excerpt,
      metaKeywords,
      seoTitle,
    } = body;

    if (!title || !content || !image || !status) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Title, content, image, and status are required.",
        },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      image,
      tags: tags || [],
      categories: categories || [],
      status,
      excerpt: excerpt || "",
      metaKeywords: metaKeywords || "",
      seoTitle: seoTitle || "",
      author: decoded.userId,
    });

    const savedBlog = await newBlog.save();

    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate("categories", "name slug description")
      .populate("author", "name email");

    console.log("Populated blog:", populatedBlog);

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: "Blog created successfully!",
        blog: populatedBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
