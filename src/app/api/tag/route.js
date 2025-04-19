import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tag from '@/models/tag';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
  
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    

    const tags = await Tag.find(query).sort({ createdAt: -1 }).lean();
    console.log("Tags found:", tags);

    return NextResponse.json(
      { 
        status: 200,
        success: true, 
        Tags: tags, 
        statusCode: 200 
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { 
        success: false, 
        message: error.message, 
        statusCode: 500 
      },
      { status: 500 }
    );
  }
}
