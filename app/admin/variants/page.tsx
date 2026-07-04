import connectToDatabase from "@/lib/db"
import Variant from "@/models/Variant"
import AdminVariantsClient from "@/components/AdminVariantsClient"

export const dynamic = "force-dynamic"

async function getVariants() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectToDatabase();
  const variants = await Variant.find({}).sort({ order: 1, createdAt: 1 }).lean();
  
  return variants.map((variant: any) => ({
    ...variant,
    _id: variant._id.toString(),
    createdAt: variant.createdAt?.toISOString(),
    updatedAt: variant.updatedAt?.toISOString(),
  }));
}

export default async function AdminVariantsPage() {
  const variants = await getVariants();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <AdminVariantsClient initialVariants={variants} />
    </div>
  )
}
