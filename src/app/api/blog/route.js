import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import Blog from "@/models/blog";
import { isValidObjectId } from "mongoose";



const getBlogsWithSEO = async (filter, skip = 0, limit = 10) => {
  const blogs = await Blog.find(filter, { __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "author",
      select: "name email", 
    })
    .populate({
      path: "categories",
      select: "name slug description _id", // _id bhi include karenge
      strictPopulate: false, 
    })
    .populate({
      path: "tags",  
      select: "name slug",  
      strictPopulate: false,  
    });

  return blogs.map((b) => ({
    ...b.toObject(),
    seo: {
      seoTitle: b.seoTitle,
      metaKeywords: b.metaKeywords,
      excerpt: b.excerpt,
    },
    // Author ko sirf name aur email ke sath return karein
    author: b.author ? { name: b.author.name, email: b.author.email } : null,
    // Categories ko name aur _id ke sath return karein
    categories: b.categories ? b.categories.map(cat => ({ name: cat.name, _id: cat._id })) : [],
    // Tags ko sirf slug ke saath return karein
    tags: b.tags ? b.tags.map(tag => ({ _id: tag._id, slug: tag.slug , name:tag.name })) : [],

  }));
};



export async function GET(req) {
  try {
    await connectDB(); // Establish the DB connection

    const { searchParams } = new URL(req.url);

    // Extract search parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Set up the filter
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
      filter.tags = { $in: [tag] };  // Filter by tag
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Handle JWT token and authorization
    let token = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) token = cookieToken.value;
    }

    // Get the total number of blogs based on filter
    const total = await Blog.countDocuments(token ? filter : { ...filter, status: "published" });

    // Handle blogs for logged-in users
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);  // Verify token

        const blogs = await getBlogsWithSEO(filter, skip, limit);
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Logged-in user: Filtered blogs",
          blogs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      } catch (err) {
        // If token expired, show only published blogs
        filter.status = "published";
        const blogs = await getBlogsWithSEO(filter, skip, limit);
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Token expired: Only published blogs shown",
          blogs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      }
    }

    // For public users, show only published blogs
    filter.status = "published";
    const blogs = await getBlogsWithSEO(filter, skip, limit);
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Public user: Only published blogs",
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
