import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category";

const populateParent = async (parentId) => {
  if (!parentId) return null; 

  try {
    const parent = await Category.findById(parentId).lean();
    return {
      _id: parent._id,
      name: parent.name,
      slug: parent.slug,
      description: parent.description,
    };
  } catch (error) {
    return null; 
  }
};

const buildCategoryTree = async (categories, parentId = null) => {
  const tree = [];

  for (const category of categories) {
    const isTopLevel = parentId === null && !category.parent;
    const isChild = category.parent?.toString() === parentId?.toString();

    if (isTopLevel || isChild) {
      const parentDetails = await populateParent(category.parent);

      const children = await buildCategoryTree(categories, category._id);

      tree.push({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parent: parentDetails, 
        children,
      });
    }
  }

  return tree;
};


export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const hasPage = searchParams.has("page");
    const hasLimit = searchParams.has("limit");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (search.trim()) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Category.countDocuments(query);

    const categories = hasPage && hasLimit
      ? await Category.find(query).skip(skip).limit(limit).lean()
      : await Category.find(query).lean();

    const tree = await buildCategoryTree(categories);

    return NextResponse.json({
      success: true,
      status: 200,
      data: tree,
      pagination: hasPage && hasLimit
        ? {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          }
        : null, 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
