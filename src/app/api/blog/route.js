import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/utils/db";
import Blog from "@/models/blog";
import Tag from "@/models/tag"; 
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
      select: "name slug description _id",
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
    author: b.author ? { name: b.author.name, email: b.author.email } : null,
    categories: b.categories ? b.categories.map(cat => ({ name: cat.name, _id: cat._id })) : [],
    tags: b.tags ? b.tags.map(tag => ({ _id: tag._id, slug: tag.slug, name: tag.name })) : [],
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

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Filter setup karna
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

    // Agar tag diya hai, toh tag slug se filter karenge
    if (tag) {
      const tagObj = await Tag.findOne({ slug: tag });
      if (tagObj) {
        filter.tags = { $in: [tagObj._id] }; // tag ke slug se ObjectId ko filter karenge
      }
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // JWT token handle karna
    let token = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const cookieToken = req.cookies.get("token");
      if (cookieToken) token = cookieToken.value;
    }

    // Total blogs count karna
    const total = await Blog.countDocuments(token ? filter : { ...filter, status: "published" });

    // Agar user logged in hai
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);  // JWT token verify karna

        // Blogs fetch karna
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
        // Agar token expired ho gaya, toh sirf published blogs dikhana
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

    // Agar public user hai, toh sirf published blogs dikhana
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
