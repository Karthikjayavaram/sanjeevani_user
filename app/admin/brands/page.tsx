import connectToDatabase from "@/lib/db"
import Brand from "@/models/Brand"
import Variant from "@/models/Variant"
import AdminBrandsClient from "@/components/AdminBrandsClient"

export const dynamic = "force-dynamic"

async function getGlobalVariants() {
  if (!process.env.MONGODB_URI) return [];
  try {
    await connectToDatabase();
    const variants = await Variant.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return variants.map((v: any) => v.name);
  } catch (error) {
    return [];
  }
}

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
  const variants = await getGlobalVariants();

  return (
    <div>
      <AdminBrandsClient initialBrands={brands} initialVariants={variants} />
    </div>
  )
}
