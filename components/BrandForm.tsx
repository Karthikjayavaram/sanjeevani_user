"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, ArrowLeft, RotateCw, ChevronDown, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Cropper, { ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css"

const VariantAdder = ({ 
  onSelect, 
  options 
}: { 
  onSelect: (val: string) => void; 
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-muted-foreground">Search Variant...</span>
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
          <div className="max-h-60 overflow-y-auto p-1" data-lenis-prevent="true">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No variant found.</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt._id}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-2 text-sm outline-none hover:bg-muted"
                  onClick={() => {
                    onSelect(opt.name);
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

const WatermarkControls = ({
  watermarkText, setWatermarkText,
  watermarkSize, setWatermarkSize,
  watermarkRotation, setWatermarkRotation,
  watermarkOpacity, setWatermarkOpacity,
  watermarkColor, setWatermarkColor
}: any) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Watermark Text</label>
      <Input 
        value={watermarkText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWatermarkText(e.target.value)}
        placeholder="e.g. Sanjeevini"
      />
      <p className="text-xs text-muted-foreground pt-1">This text will be automatically added as a diagonal watermark.</p>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Text Color</label>
      <div className="flex gap-4 items-center">
        <input 
          type="color" 
          value={watermarkColor}
          onChange={(e) => setWatermarkColor(e.target.value)}
          className="w-12 h-12 p-1 rounded cursor-pointer border border-border"
        />
        <p className="text-xs text-muted-foreground">Click to select color, or use the eyedropper in the picker to sample from the image.</p>
      </div>
    </div>
    
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex justify-between">
        <span>Size</span>
        <span>{watermarkSize}%</span>
      </label>
      <input 
        type="range" min="10" max="300" 
        value={watermarkSize} 
        onChange={(e) => setWatermarkSize(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>

    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex justify-between">
        <span>Rotation</span>
        <span>{watermarkRotation}°</span>
      </label>
      <input 
        type="range" min="-180" max="180" 
        value={watermarkRotation} 
        onChange={(e) => setWatermarkRotation(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>

    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex justify-between">
        <span>Opacity</span>
        <span>{watermarkOpacity}%</span>
      </label>
      <input 
        type="range" min="0" max="100" 
        value={watermarkOpacity} 
        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  </div>
);

export default function BrandForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState(initialData?.name || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [originalImageUrl, setOriginalImageUrl] = useState(initialData?.originalImageUrl || "")
  const [watermarkText, setWatermarkText] = useState(initialData?.watermarkText || "Sanjeevini")
  const [originalWatermarkText] = useState(initialData?.watermarkText || "Sanjeevini")
  const [watermarkSize, setWatermarkSize] = useState(initialData?.watermarkSize ?? 110)
  const [originalWatermarkSize] = useState(initialData?.watermarkSize ?? 110)
  const [watermarkX, setWatermarkX] = useState(initialData?.watermarkX ?? 50)
  const [originalWatermarkX] = useState(initialData?.watermarkX ?? 50)
  const [watermarkY, setWatermarkY] = useState(initialData?.watermarkY ?? 50)
  const [originalWatermarkY] = useState(initialData?.watermarkY ?? 50)
  const [watermarkRotation, setWatermarkRotation] = useState(initialData?.watermarkRotation ?? -65)
  const [originalWatermarkRotation] = useState(initialData?.watermarkRotation ?? -65)
  const [watermarkOpacity, setWatermarkOpacity] = useState(initialData?.watermarkOpacity ?? 100)
  const [originalWatermarkOpacity] = useState(initialData?.watermarkOpacity ?? 100)
  const [watermarkColor, setWatermarkColor] = useState(initialData?.watermarkColor ?? "#ffffff")
  const [originalWatermarkColor] = useState(initialData?.watermarkColor ?? "#ffffff")
  const [description, setDescription] = useState(initialData?.description || "")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Preview sizing state for perfect live overlay
  const previewImgRef = useRef<HTMLImageElement>(null)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const img = previewImgRef.current;
    if (!img) return;
    
    const updateSize = () => {
      setPreviewSize({ width: img.clientWidth, height: img.clientHeight });
    };
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(img);
    
    img.addEventListener('load', updateSize);
    updateSize(); // Initial check
    
    return () => {
      observer.disconnect();
      img.removeEventListener('load', updateSize);
    };
  }, [originalImageUrl, imageUrl]);

  const handleDragStart = (e: React.MouseEvent, containerType: 'crop' | 'preview') => {
    e.preventDefault();
    e.stopPropagation();
    
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = watermarkX;
    const startY = watermarkY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;
      
      const containerWidth = containerType === 'crop' ? cropBox.width : previewSize.width;
      const containerHeight = containerType === 'crop' ? cropBox.height : previewSize.height;
      
      if (containerWidth === 0 || containerHeight === 0) return;

      const percentageX = (deltaX / containerWidth) * 100;
      const percentageY = (deltaY / containerHeight) * 100;
      
      let newX = startX + percentageX;
      let newY = startY + percentageY;
      
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
      
      setWatermarkX(newX);
      setWatermarkY(newY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const cropperRef = useRef<ReactCropperElement>(null)

  // Cropper Overlay states
  const [cropBox, setCropBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const updateCropBox = () => {
    if (cropperRef.current?.cropper) {
      const data = cropperRef.current.cropper.getCropBoxData();
      if (data) {
        setCropBox({
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height
        });
      }
    }
  };

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
          formData.append("watermarkText", watermarkText);
          formData.append("watermarkSize", watermarkSize.toString());
          formData.append("watermarkX", watermarkX.toString());
          formData.append("watermarkY", watermarkY.toString());
          formData.append("watermarkRotation", watermarkRotation.toString());
          formData.append("watermarkOpacity", watermarkOpacity.toString());
          formData.append("watermarkColor", watermarkColor);
          formData.append("skipWatermark", "true");
          
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          
          if (res.ok) {
            const data = await res.json();
            setImageUrl(data.url);
            if (data.originalUrl) setOriginalImageUrl(data.originalUrl);
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
        }
      })
      .catch(err => console.error("Failed to load global variants:", err))
  }, [initialData])

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleAddSelectedVariant = (name: string) => {
    if (!variants.some(v => v.name.toLowerCase() === name.toLowerCase())) {
      setVariants([...variants, { name, isAvailable: true }]);
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
      let finalImageUrl = imageUrl;
      
      const isNewUpload = imageUrl === originalImageUrl && imageUrl !== "";
      const hasWatermarkChanged = 
        watermarkText !== originalWatermarkText || 
        watermarkSize !== originalWatermarkSize || 
        watermarkX !== originalWatermarkX || 
        watermarkY !== originalWatermarkY ||
        watermarkRotation !== originalWatermarkRotation ||
        watermarkOpacity !== originalWatermarkOpacity ||
        watermarkColor !== originalWatermarkColor;

      // If we just uploaded a new image, skipWatermark causes imageUrl === originalImageUrl.
      // So if it's a new upload or we changed settings, we must generate the final watermark now.
      if ((isNewUpload || (initialData && hasWatermarkChanged)) && originalImageUrl) {
        const watermarkRes = await fetch("/api/watermark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            originalUrl: originalImageUrl, 
            watermarkText,
            watermarkSize,
            watermarkX,
            watermarkY,
            watermarkRotation,
            watermarkOpacity,
            watermarkColor
          })
        });
        
        if (watermarkRes.ok) {
          const watermarkData = await watermarkRes.json();
          finalImageUrl = watermarkData.url;
        } else {
          setError("Failed to regenerate watermark with new settings");
          setLoading(false);
          return;
        }
      }

      const url = initialData ? `/api/brands/${initialData._id}` : "/api/brands"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          imageUrl: finalImageUrl,
          originalImageUrl,
          watermarkText,
          watermarkSize,
          watermarkX,
          watermarkY,
          watermarkRotation,
          watermarkOpacity,
          watermarkColor,
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
      <div className="max-w-6xl mx-auto pt-8">
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Crop & Watermark Image</h2>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div 
                className="w-full bg-black/50 rounded-lg overflow-hidden border border-white/10 relative"
                onPointerDownCapture={(e) => {
                  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
              >
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
                  crop={updateCropBox}
                  ready={updateCropBox}
                />
                
                {/* Live Watermark overlay right on the crop box */}
                {cropBox.width > 0 && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      left: cropBox.left,
                      top: cropBox.top,
                      width: cropBox.width,
                      height: cropBox.height,
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      className="absolute font-bold whitespace-nowrap cursor-move pointer-events-auto select-none"
                      onMouseDown={(e) => handleDragStart(e, 'crop')}
                      style={{
                        color: watermarkColor,
                        opacity: watermarkOpacity / 100,
                        left: `${watermarkX}%`,
                        top: `${watermarkY}%`,
                        transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
                        fontSize: `${Math.max(15, Math.floor(Math.min(cropBox.width, cropBox.height) * 0.20)) * (watermarkSize / 100)}px`,
                        textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: 1
                      }}
                    >
                      {watermarkText}
                    </div>
                  </div>
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => { cropperRef.current?.cropper.rotate(90); updateCropBox(); }}>
                <RotateCw className="mr-2 h-4 w-4" /> Rotate 90°
              </Button>
            </div>

            <div className="space-y-6">

              <WatermarkControls
                watermarkText={watermarkText} setWatermarkText={setWatermarkText}
                watermarkSize={watermarkSize} setWatermarkSize={setWatermarkSize}
                watermarkRotation={watermarkRotation} setWatermarkRotation={setWatermarkRotation}
                watermarkOpacity={watermarkOpacity} setWatermarkOpacity={setWatermarkOpacity}
                watermarkColor={watermarkColor} setWatermarkColor={setWatermarkColor}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="ghost" onClick={cancelCrop} disabled={uploadingImage}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUploadCrop} disabled={uploadingImage}>
              {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm & Upload
            </Button>
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
                <div className="mt-4 flex flex-col gap-4 items-start">
                  <div className="relative rounded-md overflow-hidden border border-border bg-muted/20 inline-block w-fit max-w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      ref={previewImgRef}
                      src={originalImageUrl || imageUrl} 
                      alt="Preview" 
                      className="max-h-[400px] max-w-full object-contain block" 
                    />
                    
                    {/* Live Preview Overlay */}
                    {(originalImageUrl || !initialData) && previewSize.width > 0 && (
                      <div 
                        className="absolute font-bold whitespace-nowrap cursor-move pointer-events-auto select-none"
                        onMouseDown={(e) => handleDragStart(e, 'preview')}
                        style={{
                          color: watermarkColor,
                          opacity: watermarkOpacity / 100,
                          left: `${watermarkX}%`,
                          top: `${watermarkY}%`,
                          transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
                          fontSize: `${Math.max(15, Math.floor(Math.min(previewSize.width, previewSize.height) * 0.20)) * (watermarkSize / 100)}px`,
                          textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                          fontFamily: 'Arial, sans-serif',
                          lineHeight: 1
                        }}
                      >
                        {watermarkText}
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setImageSrc(originalImageUrl || imageUrl)}
                  >
                    Crop & Edit Original Image
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
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold mb-4">Variants</h2>
            <VariantAdder 
              onSelect={handleAddSelectedVariant} 
              options={globalVariants.filter(gv => !variants.some(v => v.name.toLowerCase() === gv.name.toLowerCase()))}
            />
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-muted/20 rounded-lg border">
                <div className="flex-1 w-full">
                  <div className="font-medium text-base">{variant.name}</div>
                </div>
                <div className="w-full md:w-48 space-y-1">
                  <label className="text-xs text-muted-foreground">Stock Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={variant.isAvailable ? "available" : "unavailable"}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleVariantChange(index, "isAvailable", e.target.value === "available")}
                  >
                    <option value="available" className="bg-background text-foreground">In Stock</option>
                    <option value="unavailable" className="bg-background text-foreground">Out of Stock</option>
                  </select>
                </div>
                <div className="pt-0 md:pt-5 flex justify-end w-full md:w-auto">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
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
