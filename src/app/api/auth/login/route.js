// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import connectDB from '@/lib/db';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';


// export async function POST(req) {
//   await connectDB();

//   const body = await req.json();
//   const { email, password } = body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ status: 404, message: 'User not found' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return NextResponse.json({ status: 401, message: 'Invalid credentials' });
//   }

//   const token = jwt.sign(
//     { id: user._id, name: user.name, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );

//   const res = NextResponse.json({
//     status: 201,
//     message: 'Login successful',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//     token,
//   });

//   res.cookies.set('token', token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'strict',
//     path: '/',
//   });

//   return res;
// }


import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ status: 404, message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ status: 401, message: 'Invalid credentials' });
  }

  // Generate JWT Token with 'userId' instead of 'id'
  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },  // 'userId' instead of 'id'
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({
    status: 201,
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });

  // Set token in cookies
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return res;
}
