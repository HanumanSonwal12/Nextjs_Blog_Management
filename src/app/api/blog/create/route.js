import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/blog';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Unauthorized: No token provided.",
      }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({
        status: 403,
        success: false,
        message: "Invalid or expired token.",
      }, { status: 403 });
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
      seoTitle
    } = body;

    if (!title || !content || !image || !status) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Title, content, image, and status are required.",
      }, { status: 400 });
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
      excerpt: excerpt || '',
      metaKeywords: metaKeywords || '',
      seoTitle: seoTitle || '',
      author: decoded.id,
    });

    const savedBlog = await newBlog.save();

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Blog created successfully!",
      blog: {
        _id: savedBlog._id,
        title: savedBlog.title,
        slug: savedBlog.slug, 
        content: savedBlog.content,
        image: savedBlog.image,
        tags: savedBlog.tags,
        categories: savedBlog.categories,
        excerpt: savedBlog.excerpt,
        metaKeywords: savedBlog.metaKeywords,
        seoTitle: savedBlog.seoTitle,
        status: savedBlog.status,
        createdAt: savedBlog.createdAt,
        updatedAt: savedBlog.updatedAt
      }
    }, { status: 201 });
    

  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    }, { status: 500 });
  }
}
