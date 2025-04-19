import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Blog from "@/models/blog";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

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

    if (!token) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "Token missing. Please login.",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: "Blog not found.",
        },
        { status: 404 }
      );
    }

    if (!blog.author) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Author field is missing in the blog.",
        },
        { status: 400 }
      );
    }

    console.log("Author Type:", typeof blog.author);

    if (!mongoose.Types.ObjectId.isValid(blog.author)) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Invalid author ObjectId",
        },
        { status: 400 }
      );
    }

    console.log("Blog Author ID:", blog.author.toString());
    if (blog.author.toString() !== userId) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "You are not authorized to delete this blog.",
        },
        { status: 403 }
      );
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Error during DELETE:", error.message);
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
