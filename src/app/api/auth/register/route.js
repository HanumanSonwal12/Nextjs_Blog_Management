import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { name, email, password } = body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  // Create JWT token
  const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Set token in cookies
  const res = NextResponse.json({ message: 'User registered successfully' });
  res.cookies.set('token', token, { httpOnly: true, secure: true });

  return res;
}
