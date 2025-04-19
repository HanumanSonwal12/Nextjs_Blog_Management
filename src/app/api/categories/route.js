import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category";

const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];

  categories.forEach((category) => {
    const isTopLevel = parentId === null && !category.parent;
    const isChild = category.parent?.toString() === parentId?.toString();

    if (isTopLevel || isChild) {
      const children = buildCategoryTree(categories, category._id);

      tree.push({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parent: category.parent,
        children,
      });
    }
  });

  return tree;
};

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(query).lean();
    const tree = buildCategoryTree(categories);

    return NextResponse.json({ status: 200, success: true, data: tree });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
