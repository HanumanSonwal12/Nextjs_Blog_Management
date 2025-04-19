import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Blog from "@/models/blog";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";

const getBlogsWithSEO = async (filter) => {
  const blogs = await Blog.find(filter, { __v: 0 })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "name email",
    })
    .populate({
      path: "categories",
      select: "name slug description",
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

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category && isValidObjectId(category)) {
      filter.categories = category;
    }

    if (author && isValidObjectId(author)) {
      filter.author = author;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let token = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) token = cookieToken.value;
    }

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        const blogs = await getBlogsWithSEO(filter);
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Logged-in user: Filtered blogs",
          blogs,
        });
      } catch (err) {
        filter.status = "published";
        const blogs = await getBlogsWithSEO(filter);
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Token expired: Only published blogs shown",
          blogs,
        });
      }
    }

    filter.status = "published";
    const blogs = await getBlogsWithSEO(filter);
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Public user: Only published blogs",
      blogs,
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
