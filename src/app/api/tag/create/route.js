import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, description, slug } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    let finalSlug = slug
      ? slugify(slug, { lower: true })
      : slugify(name, { lower: true });

    let slugExists = await Tag.findOne({ slug: finalSlug });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${slugify(name, { lower: true })}-${counter}`;
      slugExists = await Tag.findOne({ slug: finalSlug });
      counter++;
    }

    const newTag = await Tag.create({
      name,
      slug: finalSlug,
      description,
    });

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Tag created",
      tag: newTag,
      statusCode: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
