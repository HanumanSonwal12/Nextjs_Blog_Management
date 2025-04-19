import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category";
import slugify from "slugify";

// GET single category by ID
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// UPDATE category by ID
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const body = await req.json();
    const { name, slug: customSlug, parent, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    let updatedSlug = customSlug
      ? slugify(customSlug, { lower: true })
      : slugify(name, { lower: true });

    const existingCategory = await Category.findOne({ slug: updatedSlug });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return NextResponse.json(
        { success: false, message: "Slug already exists for another category" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: updatedSlug,
        parent: parent || null,
        description: description || "",
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE category by ID
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
