import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/blog';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, content, image, tags, categories, status, excerpt, metaKeywords, seoTitle } = body;

    // ✅ Step 1: Required field validation
    if (!title || !content || !image || !status) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Title, content, image, and status are required fields."
        },
        { status: 400 }
      );
    }

    // ✅ Step 2: Create new blog
    const newBlog = new Blog({
      title,
      content,
      image,
      tags: tags || [],
      categories: categories || [],
      status,
      excerpt: excerpt || '',
      metaKeywords: metaKeywords || '',
      seoTitle: seoTitle || ''
    });

    const savedBlog = await newBlog.save();

    // ✅ Step 3: Return success response
    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: "Blog created successfully!",
        blog: savedBlog
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Blog creation failed:", error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: error.message
      },
      { status: 500 }
    );
  }
}
