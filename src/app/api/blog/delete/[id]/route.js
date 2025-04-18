import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Blog from "@/models/blog";
import connectDB from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Get Token
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

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find blog
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

    // Authorization check
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

    // Delete blog
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog deleted successfully.",
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
