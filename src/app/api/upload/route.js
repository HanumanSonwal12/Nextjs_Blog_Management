import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  try {
    const uploadRes = await cloudinary.uploader.upload(dataUrl, {
      folder: "blogs",
    });

    return NextResponse.json({
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
