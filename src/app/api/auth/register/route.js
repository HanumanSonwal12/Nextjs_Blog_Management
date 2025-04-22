import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: "Name, email, and password are required.",
      },
      { status: 400 }
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: "User already exists with this email.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, name: newUser.name, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json(
    {
      status: 201,
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    { status: 201 }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
