import connectToDatabase from "@/lib/db"
import Brand from "@/models/Brand"
import { Package, TrendingUp, AlertCircle, Database } from "lucide-react"
import { InventoryBarChart, StatusPieChart } from "@/components/AdminCharts"

export const dynamic = "force-dynamic"

async function getStats() {
  if (!process.env.MONGODB_URI) {
    return { totalBrands: 0, totalStock: 0, outOfStockBrands: 0, brands: [] };
  }

  await connectToDatabase();
  const dbBrands = await Brand.find({}).lean();
  
  // Serialize Mongoose ObjectIds and dates to strings so they can be passed to Client Components
  const brands = dbBrands.map((brand: any) => ({
    ...brand,
    _id: brand._id.toString(),
    createdAt: brand.createdAt?.toISOString(),
    updatedAt: brand.updatedAt?.toISOString(),
    variants: (brand.variants || []).map((v: any) => ({
      ...v,
      _id: v._id ? v._id.toString() : undefined
    }))
  }));

  const totalBrands = brands.length;
  const totalStock = brands.reduce((acc: number, brand: any) => acc + (brand.totalStock || 0), 0);
  const outOfStockBrands = brands.filter((brand: any) => brand.totalStock === 0).length;

  return { totalBrands, totalStock, outOfStockBrands, brands };
}

export default async function AdminDashboard() {
  const { totalBrands, totalStock, outOfStockBrands, brands } = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 font-playfair text-gradient-gold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your warehouse stock and brand inventory.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Brands</h3>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="text-4xl font-bold font-playfair">{totalBrands}</div>
          <p className="text-xs text-muted-foreground mt-2">Active in warehouse</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Stock</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-4xl font-bold font-playfair">{totalStock}</div>
          <p className="text-xs text-muted-foreground mt-2">Total bags available</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Out of Stock</h3>
            <AlertCircle className={`h-5 w-5 ${outOfStockBrands > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <div className="text-4xl font-bold font-playfair">{outOfStockBrands}</div>
          <p className="text-xs text-muted-foreground mt-2">Brands requiring restock</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Top Inventory Brands</h3>
          </div>
          <InventoryBarChart data={brands} />
        </div>
        
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Availability Status</h3>
          </div>
          <StatusPieChart data={brands} />
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2E5A27]" />
              <span className="text-sm text-muted-foreground">In Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#991B1B]" />
              <span className="text-sm text-muted-foreground">Out of Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
