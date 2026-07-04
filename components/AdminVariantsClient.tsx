"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminVariantsClient({ initialVariants }: { initialVariants: any[] }) {
  const [variants, setVariants] = useState(initialVariants)
  const [newVariantName, setNewVariantName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVariantName.trim()) return

    setIsAdding(true)
    setError("")

    try {
      const res = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newVariantName.trim(), order: variants.length }),
      })

      if (res.ok) {
        const newVariant = await res.json()
        setVariants([...variants, newVariant])
        setNewVariantName("")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to add variant")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return
    
    setDeletingId(id)
    setError("")
    
    try {
      const res = await fetch(`/api/variants/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setVariants(variants.filter(v => v._id !== id))
        router.refresh()
      } else {
        setError("Failed to delete variant")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Manage Global Variants</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="glass rounded-xl overflow-hidden mb-8 p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add New Variant</h2>
        <form onSubmit={handleAdd} className="flex gap-4">
          <Input 
            placeholder="e.g. 5 kg with Handle" 
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
            className="flex-1 bg-background/50"
            disabled={isAdding}
          />
          <Button type="submit" disabled={isAdding || !newVariantName.trim()}>
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Variant
          </Button>
        </form>
      </div>

      <div className="glass rounded-xl overflow-hidden max-w-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-semibold">Variant Name</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-muted-foreground">
                    No variants found. Add some above.
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <tr key={variant._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{variant.name}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(variant._id)}
                        disabled={deletingId === variant._id}
                      >
                        {deletingId === variant._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
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
