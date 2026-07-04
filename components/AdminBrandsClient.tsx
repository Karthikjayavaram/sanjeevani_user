"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import VariantChips from '@/components/VariantChips'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminBrandsClient({ initialBrands, initialVariants }: { initialBrands: any[], initialVariants: string[] }) {
  const [brands, setBrands] = useState(initialBrands)
  const [search, setSearch] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  // Helper to normalize strings (ignore case & spaces)
  const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase());
    const matchesVariant = selectedVariant === "" || brand.variants.some((v: any) => normalize(v.name) === normalize(selectedVariant));
    return matchesSearch && matchesVariant;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError("")
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setBrands(brands.filter(b => b._id !== id))
        router.refresh()
      } else {
        setError("Failed to delete brand")
      }
    } catch (err) {
      setError("An error occurred while deleting")
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 rounded-md bg-destructive/15 border border-destructive text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Delete Brand</h3>
            <p className="text-muted-foreground mb-8">
              Are you sure you want to delete this brand? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteId(null)}
                disabled={deletingId === confirmDeleteId}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
              >
                {deletingId === confirmDeleteId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Manage Brands</h1>

      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search brands..." 
          className="pl-9 bg-background/50"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>
        {/* Variant Chips Filter */}
        <div className="mb-6 w-full">
          <VariantChips
            options={[
              "All Variants",
              ...initialVariants,
              ...Array.from(new Set(brands.flatMap(b => b.variants.map((v: any) => v.name?.trim()).filter(Boolean))))
                .filter(v => !initialVariants.some((dv: string) => dv.toLowerCase() === v.toLowerCase()))
            ]}
            onSelect={(value) => setSelectedVariant(value === 'All Variants' ? '' : value)}
          />
        </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Brand Name</th>
                <th className="p-4 font-semibold">Total Stock</th>
                <th className="p-4 font-semibold">Variants</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No brands found.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={brand.imageUrl || "https://placehold.co/100x100"} 
                        alt={brand.name} 
                        className="w-12 h-12 object-contain rounded-md bg-muted/30 p-1"
                      />
                    </td>
                    <td className="p-4 font-medium">{brand.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        brand.totalStock > 0 ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-red-500/20 text-red-700 dark:text-red-400"
                      }`}>
                        {brand.totalStock} Bags
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{brand.variants.length}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/brands/${brand._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setConfirmDeleteId(brand._id)}
                          disabled={deletingId === brand._id}
                        >
                          {deletingId === brand._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
