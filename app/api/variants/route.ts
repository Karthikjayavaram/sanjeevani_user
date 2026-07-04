import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Variant from "@/models/Variant";

export async function GET() {
  try {
    await connectToDatabase();
    const variants = await Variant.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(variants);
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, order } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid variant name" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Check if exists
    const existing = await Variant.findOne({ name: name.trim() });
    if (existing) {
      return NextResponse.json({ error: "Variant already exists" }, { status: 409 });
    }

    const variant = await Variant.create({
      name: name.trim(),
      order: order || 0,
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error("Failed to create variant:", error);
    return NextResponse.json({ error: "Failed to create variant" }, { status: 500 });
  }
}

