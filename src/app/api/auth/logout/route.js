import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logout successful' });
  
  // Clear the token from cookies
  res.cookies.set('token', '', { httpOnly: true, secure: true, expires: new Date(0) });

  return res;
}
