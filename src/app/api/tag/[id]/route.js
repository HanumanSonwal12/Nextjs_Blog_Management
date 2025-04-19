import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tag from "@/models/tag";
import slugify from "slugify";

// GET Single Tag
export async function GET(req, { params }) {
  await connectDB();
  try {
    const tag = await Tag.findById(params.id).lean();

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found", statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, success: true, data: tag },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500 },
      { status: 500 }
    );
  }
}

// PUT - Update Tag
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();
    const { name, description, slug } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required", statusCode: 400 },
        { status: 400 }
      );
    }

    let finalSlug = slug
      ? slugify(slug, { lower: true })
      : slugify(name, { lower: true });

    let existingTag = await Tag.findOne({ slug: finalSlug, _id: { $ne: id } });
    let counter = 1;
    while (existingTag) {
      finalSlug = `${slugify(name, { lower: true })}-${counter}`;
      existingTag = await Tag.findOne({ slug: finalSlug, _id: { $ne: id } });
      counter++;
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name, description, slug: finalSlug },
      { new: true }
    );

    if (!updatedTag) {
      return NextResponse.json(
        { success: false, message: "Tag not found", statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tag updated",
        tag: updatedTag,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500 },
      { status: 500 }
    );
  }
}

//  DELETE - Remove Tag
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const deletedTag = await Tag.findByIdAndDelete(params.id);

    if (!deletedTag) {
      return NextResponse.json(
        { success: false, message: "Tag not found", statusCode: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tag deleted", statusCode: 200 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500 },
      { status: 500 }
    );
  }
}
