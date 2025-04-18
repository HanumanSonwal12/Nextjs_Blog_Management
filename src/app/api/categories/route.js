import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/category';
import slugify from 'slugify';

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, parent } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true });

    const newCategory = await Category.create({
      name,
      slug,
      parent: parent || null
    });

    return NextResponse.json({ success: true, message: "Category created", category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
