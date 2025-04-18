import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/category';

// Recursive function to build tree
const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];

  categories.forEach(category => {
    if ((parentId === null && !category.parent) || (category.parent?.toString() === parentId?.toString())) {
      const children = buildCategoryTree(categories, category._id);
      tree.push({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        parent: category.parent,
        children
      });
    }
  });

  return tree;
};

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // Build query for search
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const categories = await Category.find(query).lean();
    const tree = buildCategoryTree(categories);

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
