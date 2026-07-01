import { Suspense } from "react"
import { HeroSection } from "@/components/HomeClient"
import BrandsClient from "@/components/BrandsClient"
import SmoothScroll from "@/components/SmoothScroll"
import connectToDatabase from "@/lib/db"
import Brand from "@/models/Brand"

export const dynamic = "force-dynamic"

async function getBrands() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Using mock data for preview.");
    return [
      {
        _id: "mock1",
        name: "Royal Basmati Premium",
        description: "High quality long grain basmati rice.",
        imageUrl: "https://placehold.co/400x500?text=Basmati+Rice",
        variants: [{ _id: "v1", name: "25kg", stockQuantity: 50 }, { _id: "v3", name: "10kg", stockQuantity: 120 }],
        totalStock: 170,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "mock2",
        name: "Sona Masoori",
        description: "Light and aromatic short grain rice.",
        imageUrl: "https://placehold.co/400x500?text=Sona+Masoori",
        variants: [{ _id: "v2", name: "10kg", stockQuantity: 0 }],
        totalStock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  try {
    await connectToDatabase();
    const brands = await Brand.find({}).sort({ updatedAt: -1 }).lean();
    
    return brands.map((brand: any) => ({
      ...brand,
      _id: brand._id.toString(),
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
      totalStock: (brand.variants || []).reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0),
      variants: (brand.variants || []).map((v: any) => ({
        ...v,
        _id: v._id.toString()
      }))
    }));
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export default async function Home() {
  const brands = await getBrands();
  const totalBags = brands.reduce((sum: number, b: any) => sum + b.totalStock, 0);
  const totalBrands = brands.length;

  return (
    <SmoothScroll>
      <HeroSection />
      
      <section id="brands" className="py-32 bg-black relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20 text-center flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-black font-playfair tracking-tight mb-6 text-gradient-gold">
              Featured Brands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl font-light">
              Browse our premium selection of rice brands. Live stock updates directly from our warehouse floor.
            </p>
          </div>

          <Suspense fallback={<div className="animate-pulse h-96 bg-muted/10 rounded-[2rem] border border-white/5"></div>}>
            <BrandsClient initialBrands={brands} />
          </Suspense>
        </div>
      </section>
    </SmoothScroll>
  )
}
