import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Variant from "@/models/Variant";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();
    
    const variant = await Variant.findByIdAndDelete(id);
    
    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Cascade delete: remove this variant from all brands
    const Brand = (await import("@/models/Brand")).default;
    await Brand.updateMany(
      {},
      { $pull: { variants: { name: variant.name } } }
    );

    return NextResponse.json({ success: true, message: "Variant deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete variant:", error);
    return NextResponse.json({ error: "Failed to delete variant" }, { status: 500 });
  }
}
