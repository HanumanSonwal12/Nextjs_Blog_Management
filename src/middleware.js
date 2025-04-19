import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Public routes where login is not required
const PUBLIC_ROUTES = ["/login", "/register"];

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Allow public routes (login, register)
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // If token is not available, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT token
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    console.log("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Match all routes except login and register
export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/blog/:path*"],
};
