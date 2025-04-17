import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import connectDB from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { value } = params;

    let blog;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);

    if (isObjectId) {
      blog = await Blog.findById(value).populate("author", "name email");
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: value }).populate("author", "name email");
    }

    if (!blog) {
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
