import connectToDatabase from "@/lib/db"
import Brand from "@/models/Brand"
import AdminBrandsClient from "@/components/AdminBrandsClient"

export const dynamic = "force-dynamic"

async function getBrands() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectToDatabase();
  const brands = await Brand.find({}).sort({ updatedAt: -1 }).lean();
  
  return brands.map((brand: any) => ({
    ...brand,
    _id: brand._id.toString(),
    createdAt: brand.createdAt?.toISOString(),
    updatedAt: brand.updatedAt?.toISOString(),
    variants: (brand.variants || []).map((v: any) => ({
      ...v,
      _id: v._id ? v._id.toString() : undefined
    }))
  }));
}

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div>
      <AdminBrandsClient initialBrands={brands} />
    </div>
  )
}
