import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Category from "@/models/category";
import slugify from "slugify";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, slug: customSlug, parent, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    let baseSlug = customSlug
      ? slugify(customSlug, { lower: true })
      : slugify(name, { lower: true });
    let finalSlug = baseSlug;

    let count = 1;
    while (await Category.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const newCategory = await Category.create({
      name,
      slug: finalSlug,
      description: description || "",
      parent: parent || null,
    });

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
