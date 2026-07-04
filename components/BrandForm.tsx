"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, ArrowLeft, RotateCw, ChevronDown, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Cropper, { ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css"

const SearchableVariantSelect = ({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { _id: string, name: string }[] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase()));
  const isLegacy = value && !options.some(opt => opt.name === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? (isLegacy ? `${value} (Legacy)` : value) : "Select a global variant..."}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-background text-foreground shadow-lg outline-none animate-in fade-in-80">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search variants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No variant found.</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt._id}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-2 text-sm outline-none hover:bg-muted ${value === opt.name ? 'bg-muted' : ''}`}
                  onClick={() => {
                    onChange(opt.name);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function BrandForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState(initialData?.name || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const cropperRef = useRef<ReactCropperElement>(null)

  const handleImageFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file")
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  const handleUploadCrop = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setUploadingImage(true);
      setError("");
      try {
        const canvas = cropperRef.current?.cropper.getCroppedCanvas();
        if (!canvas) {
          setError("Failed to crop image");
          setUploadingImage(false);
          return;
        }
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setError("Failed to create image blob");
            setUploadingImage(false);
            return;
          }
          
          const formData = new FormData();
          formData.append("file", blob, "cropped.jpg");
          
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          
          if (res.ok) {
            const data = await res.json();
            setImageUrl(data.url);
            setImageSrc(null);
          } else {
            const errData = await res.json();
            setError(errData.error || "Failed to upload image");
          }
          setUploadingImage(false);
        }, "image/jpeg", 0.9);
      } catch (err) {
        setError("Error uploading image");
        setUploadingImage(false);
      }
    }
  }

  const cancelCrop = () => {
    setImageSrc(null);
  }

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept if they are typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [variants, setVariants] = useState<any[]>(
    initialData?.variants || []
  )
  const [globalVariants, setGlobalVariants] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/variants")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGlobalVariants(data);
          // Pre-populate if we are creating a new brand
          if (!initialData?.variants) {
            setVariants(data.map((v: any) => ({ name: v.name, isAvailable: true })))
          }
        }
      })
      .catch(err => console.error("Failed to load global variants:", err))
  }, [initialData])

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const addVariant = () => {
    // Pick the first global variant that isn't already added
    const unusedVariant = globalVariants.find(gv => !variants.some(v => v.name.toLowerCase() === gv.name.toLowerCase()));
    if (unusedVariant) {
      setVariants([...variants, { name: unusedVariant.name, isAvailable: true }])
    } else {
      // If all are used, just add empty or don't add
      setVariants([...variants, { name: "", isAvailable: true }])
    }
  }

  const removeVariant = (index: number) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = initialData ? `/api/brands/${initialData._id}` : "/api/brands"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          imageUrl,
          description,
          variants: variants.filter(v => v.name.trim() !== "") // Remove empty variants
        }),
      })

      if (res.ok) {
        router.push("/admin/brands")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (imageSrc) {
    return (
      <div className="max-w-4xl mx-auto pt-8">
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Crop & Rotate Image</h2>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          <div className="w-full bg-black/50 rounded-lg overflow-hidden border border-white/10">
            <Cropper
              src={imageSrc}
              style={{ height: 400, width: "100%" }}
              initialAspectRatio={NaN}
              guides={true}
              autoCropArea={1}
              viewMode={1}
              dragMode="move"
              ref={cropperRef}
              background={false}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => cropperRef.current?.cropper.rotate(90)}>
              <RotateCw className="mr-2 h-4 w-4" /> Rotate 90°
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={cancelCrop} disabled={uploadingImage}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUploadCrop} disabled={uploadingImage}>
                {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Upload Cropped Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/admin/brands">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">
        {initialData ? "Edit Brand" : "Add New Brand"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Name *</label>
              <Input 
                required 
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="e.g. Royal Basmati"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Image</label>
              <div className="flex gap-2">
                <div className="relative flex items-center justify-center w-full">
                  <Input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files?.[0]) handleImageFile(e.target.files[0])
                    }}
                  />
                  <Button type="button" variant="outline" disabled={uploadingImage} className="w-full pointer-events-none h-10 bg-muted/10 border-dashed hover:bg-muted/30">
                    {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {uploadingImage ? "Uploading..." : "Click to Upload Image"}
                  </Button>
                </div>
              </div>
              {imageUrl && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-32 w-32 rounded-md overflow-hidden border border-border bg-muted/20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setImageSrc(imageUrl)}
                    className="shrink-0"
                  >
                    Crop & Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Brief description about the brand..."
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Variants & Stock</h2>
            {initialData && (
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="mr-2 h-4 w-4" /> Add Variant
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-muted/20 rounded-lg border">
                <div className="flex-1 space-y-1 w-full">
                  <label className="text-xs text-muted-foreground">Variant Name</label>
                  <SearchableVariantSelect
                    value={variant.name}
                    onChange={(val) => handleVariantChange(index, "name", val)}
                    options={globalVariants}
                  />
                </div>
                <div className="w-full md:w-40 space-y-1">
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={variant.isAvailable ? "available" : "unavailable"}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleVariantChange(index, "isAvailable", e.target.value === "available")}
                  >
                    <option value="available" className="bg-background text-foreground">Available</option>
                    <option value="unavailable" className="bg-background text-foreground">Unavailable</option>
                  </select>
                </div>
                <div className="pt-5 flex justify-end w-full md:w-auto">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/brands">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {initialData ? "Update Brand" : "Save Brand"}
          </Button>
        </div>
      </form>
    </div>
  )
}
