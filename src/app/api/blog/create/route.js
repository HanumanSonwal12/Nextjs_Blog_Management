import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import User from "@/models/User";
import Tag from "@/models/tag";  // Ensure correct import for tags
import Category from "@/models/category"; // Ensure Category model import

export async function POST(req) {
  try {
    // Establish connection to the database
    await connectDB();

    // Check for the JWT token in cookies
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

    // Decode the JWT token
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

    // Find the user from the decoded token
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

    // Parse the request body
    const body = await req.json();
    const {
      title,
      content,
      image,
      tags, // Multiple tags
      categories, // Categories array
      status, // blog status (draft/published)
      excerpt,
      metaKeywords,
      seoTitle,
    } = body;

    // Validate mandatory fields
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

    // Validate if tags are passed and exist in the Tag model
    if (tags && tags.length > 0) {
      const tagCheck = await Tag.find({ _id: { $in: tags } });
      if (tagCheck.length !== tags.length) {
        return NextResponse.json(
          {
            status: 400,
            success: false,
            message: "Some tags are invalid.",
          },
          { status: 400 }
        );
      }
    }

    // Validate categories
    if (categories && categories.length > 0) {
      const categoryCheck = await Category.find({ _id: { $in: categories } });
      if (categoryCheck.length !== categories.length) {
        return NextResponse.json(
          {
            status: 400,
            success: false,
            message: "Some categories are invalid.",
          },
          { status: 400 }
        );
      }
    }

    // Create a unique slug for the blog post
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Create the blog post with the provided data
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
      author: decoded.userId, // The user who created the blog
    });

    // Save the blog to the database
    const savedBlog = await newBlog.save();

    // Populate the blog with categories, tags, and author information
    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate("categories", "name slug description") // Populating categories
      .populate("tags", "name slug description") // Populating tags
      .populate("author", "name email"); // Populating author details

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
