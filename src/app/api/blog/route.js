import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Import database connection utility
import Blog from '@/models/blog'; // Import blog model
import { verifyToken } from '@/lib/auth'; // Import token verification utility

export async function GET(req) {
  try {
    // Step 1: Connect to the database
    await connectDB();

    // Step 2: Get the token from cookies (if available)
    const cookies = req.cookies;
    const token = cookies.token;

    let blogs = [];

    // Step 3: If token is present, verify it and fetch user-specific blogs (draft + publish)
    if (token) {
      try {
        // Step 3.1: Verify the token and get user details
        const user = verifyToken(token);

        // Step 3.2: Fetch blogs created by the user (both publish and draft)
        blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });

        return NextResponse.json({
          status: 200,
          success: true,
          message: 'Dashboard: All blogs (publish + draft) fetched successfully.',
          blogs
        }, { status: 200 });
      } catch (error) {
        // If token is invalid or expired
        return NextResponse.json({
          status: 401,
          success: false,
          message: 'Invalid or expired token',
          error: error.message
        }, { status: 401 });
      }
    } else {
      // Step 4: If no token, fetch only published blogs publicly
      blogs = await Blog.find({ status: 'publish' }).sort({ createdAt: -1 });

      return NextResponse.json({
        status: 200,
        success: true,
        message: 'Public: Only published blogs fetched successfully.',
        blogs
      }, { status: 200 });
    }

  } catch (error) {
    // Step 5: If there is any server error
    console.error('Error while fetching blogs:', error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: 'Internal server error while fetching blogs',
      error: error.message
    }, { status: 500 });
  }
}
