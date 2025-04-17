import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check password validity
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Set token in cookies
  const res = NextResponse.json({ message: 'Login successful' });
  res.cookies.set('token', token, { httpOnly: true, secure: true });

  return res;
}
