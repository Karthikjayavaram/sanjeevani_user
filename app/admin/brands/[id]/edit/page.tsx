import { notFound } from "next/navigation"
import connectToDatabase from "@/lib/db"
import Brand from "@/models/Brand"
import BrandForm from "@/components/BrandForm"

export const dynamic = "force-dynamic"

async function getBrand(id: string) {
  try {
    await connectToDatabase();
    const brand = await Brand.findById(id).lean();
    if (!brand) return null;
    
    return {
      ...brand,
      _id: brand._id.toString(),
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
      variants: brand.variants.map((v: any) => ({
        ...v,
        _id: v._id.toString()
      }))
    };
  } catch (e) {
    return null;
  }
}

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  return <BrandForm initialData={brand} />
}
