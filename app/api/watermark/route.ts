import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { originalUrl, watermarkText } = await req.json();

    if (!originalUrl) {
      return NextResponse.json({ error: "No original URL provided" }, { status: 400 });
    }

    const text = watermarkText || "Sanjeevini";

    // Fetch the original image buffer
    const response = await fetch(originalUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch original image" }, { status: 500 });
    }

    const bytes = await response.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // Process with sharp
    const metadata = await sharp(originalBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 800;
    const fontSize = Math.max(30, Math.floor(Math.min(width, height) * 0.15));

    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { 
        fill: rgba(255, 255, 255, 0.4); 
        font-size: ${fontSize}px; 
        font-weight: bold; 
        font-family: Arial, sans-serif; 
        text-shadow: 2px 2px 6px rgba(0,0,0,0.6); 
      }
      </style>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="title" transform="rotate(-45, ${width/2}, ${height/2})">${text}</text>
    </svg>
    `;

    const watermarkedBuffer = await sharp(originalBuffer)
      .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
      .toFormat('jpeg')
      .toBuffer();

    const watermarkedFileBase64 = `data:image/jpeg;base64,${watermarkedBuffer.toString("base64")}`;
    
    const watermarkedUploadResponse = await cloudinary.uploader.upload(watermarkedFileBase64, {
      folder: "sanjeevani_uploads",
    });
    
    return NextResponse.json({ 
      url: watermarkedUploadResponse.secure_url
    });
  } catch (e) {
    console.error("Watermark generation error:", e);
    return NextResponse.json({ error: "Watermark generation failed" }, { status: 500 });
  }
}
