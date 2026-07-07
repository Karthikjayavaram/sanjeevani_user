import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    // Check for Brand + Variant duplicates
    if (body.variants && body.variants.length > 0) {
      const existingBrands = await Brand.find({ 
        name: { $regex: new RegExp(`^${body.name}$`, 'i') },
        _id: { $ne: id }
      });
      for (const brand of existingBrands) {
        for (const variant of body.variants) {
          if (brand.variants.some((v: any) => v.name.toLowerCase() === variant.name.toLowerCase())) {
            return NextResponse.json(
              { error: "This brand with the selected variant already exists." }, 
              { status: 400 }
            );
          }
        }
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
    console.error("Failed to update brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
