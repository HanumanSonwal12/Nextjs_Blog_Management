import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/sign-up"];

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  console.log("Middleware path:", path);

  // Allow /api and /images routes without token check
  if (path.startsWith("/api") || path.startsWith("/images")) {
    return NextResponse.next();
  }

  // Allow public routes like login and sign-up
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }

  // If no token is present, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Validate token
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    console.log("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|images|logo.png).*)", // Exclude /api, /images, and other static files
  ],
};
