import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tag from '@/models/tag';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query = {};
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') }; 
    }

    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      Tag.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tag.countDocuments(query),
    ]);

    return NextResponse.json({
      status: 200,
      success: true,
      tags,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
