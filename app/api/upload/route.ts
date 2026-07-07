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
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const watermarkText = (data.get("watermarkText") as string) || "Sanjeevini";
    const watermarkSize = parseInt(data.get("watermarkSize") as string) || 110;
    const watermarkX = parseInt(data.get("watermarkX") as string) || 50;
    const watermarkY = parseInt(data.get("watermarkY") as string) || 50;
    const watermarkRotation = data.has("watermarkRotation") ? parseInt(data.get("watermarkRotation") as string) : -65;
    const watermarkOpacity = data.has("watermarkOpacity") ? parseInt(data.get("watermarkOpacity") as string) : 100;
    const watermarkColor = (data.get("watermarkColor") as string) || "#ffffff";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);
    
    // Upload original to Cloudinary
    const originalFileBase64 = `data:${file.type};base64,${originalBuffer.toString("base64")}`;
    const originalUploadResponse = await cloudinary.uploader.upload(originalFileBase64, {
      folder: "sanjeevani_uploads/originals",
    });

    const skipWatermark = data.get("skipWatermark") === "true";
    if (skipWatermark) {
      return NextResponse.json({ 
        url: originalUploadResponse.secure_url,
        originalUrl: originalUploadResponse.secure_url
      });
    }

    // Process with sharp
    const metadata = await sharp(originalBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 800;
    
    // Base font size is 20% of smallest dimension, then scaled by watermarkSize percentage
    const baseFontSize = Math.max(30, Math.floor(Math.min(width, height) * 0.20));
    const fontSize = Math.floor(baseFontSize * (watermarkSize / 100));

    const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
      .title { 
        fill: ${watermarkColor}; 
        fill-opacity: ${watermarkOpacity / 100};
        font-size: ${fontSize}px;  
        font-weight: bold; 
        font-family: Arial, sans-serif; 
        text-shadow: 2px 2px 6px rgba(0,0,0,0.6); 
      }
      </style>
      <text x="${watermarkX}%" y="${watermarkY}%" text-anchor="middle" dominant-baseline="middle" class="title" transform="rotate(${watermarkRotation}, ${width * (watermarkX / 100)}, ${height * (watermarkY / 100)})">${watermarkText}</text>
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
      url: watermarkedUploadResponse.secure_url,
      originalUrl: originalUploadResponse.secure_url
    });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
