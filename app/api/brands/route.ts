import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, available, out_of_stock

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const brands = await Brand.find(query).sort({ updatedAt: -1 });

    let filteredBrands = brands;
    if (filter === "available") {
      filteredBrands = brands.filter((brand: any) => brand.totalStock > 0);
    } else if (filter === "out_of_stock") {
      filteredBrands = brands.filter((brand: any) => brand.totalStock === 0);
    }

    return NextResponse.json(filteredBrands, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newBrand = await Brand.create(body);

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create brand:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Brand name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
