import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Blog from "@/models/blog";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    let token;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) token = cookieToken.value;
    }

    if (!token) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Authentication required: No token provided",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { title, content, status, seoTitle, metaKeywords, excerpt, tags } =
      await req.json();

    if (!title || !content) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Title and Content are required",
        },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { status: 404, success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    if (blog.author.toString() !== userId) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "You are not authorized to update this blog",
        },
        { status: 403 }
      );
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.status = status || blog.status;
    blog.seoTitle = seoTitle || blog.seoTitle;
    blog.metaKeywords = metaKeywords || blog.metaKeywords;
    blog.excerpt = excerpt || blog.excerpt;
    blog.tags = tags || blog.tags;

    await blog.save();

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog updated successfully",
      blog,
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

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    let token;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) token = cookieToken.value;
    }

    if (!token) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Authentication required: No token provided",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { status: 400, success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { status: 404, success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    if (blog.author.toString() !== userId) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "You are not authorized to update this blog",
        },
        { status: 403 }
      );
    }

    blog.status = status;
    await blog.save();

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog status updated successfully",
      blog,
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
