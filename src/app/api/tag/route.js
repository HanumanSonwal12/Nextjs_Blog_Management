import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Tag from '@/models/tag';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';

    const hasPage = searchParams.has('page');
    const hasLimit = searchParams.has('limit');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') };
    }

    let tags, total;

    if (hasPage && hasLimit) {
      // Paginated data
      [tags, total] = await Promise.all([
        Tag.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Tag.countDocuments(query),
      ]);
    } else {
      // Fetch all if no page/limit
      tags = await Tag.find(query).sort({ createdAt: -1 }).lean();
      total = tags.length;
    }

    return NextResponse.json({
      status: 200,
      success: true,
      tags,
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
    console.error("Error:", error);

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
