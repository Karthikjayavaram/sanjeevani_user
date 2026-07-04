"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import VariantChips from "@/components/VariantChips"

export default function BrandsClient({ initialBrands, initialVariants }: { initialBrands: any[], initialVariants: string[] }) {
  const [search, setSearch] = useState("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Helper to normalize strings for comparison (ignore case & spaces)
  const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();

  const filteredBrands = useMemo(() => {
    return initialBrands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false;

      if (selectedVariant) {
        // Compare normalized variant names
        return brand.variants.some((v: any) => normalize(v.name) === normalize(selectedVariant));
      }

      return true;
    });
  }, [initialBrands, search, selectedVariant]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <div>
      <motion.div 
        className="flex flex-col gap-6 max-w-4xl mx-auto mb-16"
        variants={item}
      >
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            type="text" 
            placeholder="Search premium brands..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-full focus-visible:ring-primary/50 transition-all shadow-inner"
          />
        </div>
        <div className="w-full flex justify-center">
          <VariantChips
            options={[
              "All Variants",
              ...initialVariants,
              ...Array.from(new Set(initialBrands.flatMap(b => b.variants.map((v: any) => v.name?.trim()).filter(Boolean))))
                .filter(v => !initialVariants.some((dv: string) => dv.toLowerCase() === v.toLowerCase()))
            ]}
            onSelect={(value) => setSelectedVariant(value === "All Variants" ? "" : value)}
          />
        </div>
      </motion.div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <h3 className="text-xl font-medium mb-2">No brands found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredBrands.map((brand) => (
            <motion.div 
              key={brand._id} 
              variants={item}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="group h-full glass-dark rounded-[2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all duration-500 border border-white/5 hover:border-primary/30 relative">
                <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent p-8 flex flex-col items-center justify-center">
                  
                  {/* Glowing background behind image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/40 transition-colors duration-700" />
                  
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={brand.imageUrl || "https://placehold.co/400x500?text=Premium+Rice"} 
                    alt={brand.name} 
                    className="object-contain h-full w-full relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"
                  />
                  
                  <div className="absolute top-6 right-6 z-20">
                    {brand.totalStock > 0 ? (
                      <span className="bg-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full border border-primary/30 backdrop-blur-md shadow-lg shadow-primary/20">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-md">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-8 relative bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-2xl font-playfair font-bold mb-3 text-white group-hover:text-primary transition-colors">{brand.name}</h2>
                  
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                    <span className="text-sm text-muted-foreground uppercase tracking-widest">Status</span>
                    <span className={`font-bold text-lg ${brand.totalStock > 0 ? "text-green-400" : "text-red-400"}`}>
                      {brand.totalStock > 0 ? "Available" : "Not Available"}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-primary/80 mb-2">Variants</h3>
                    {(() => {
                      const allVariants = brand.variants;
                      const isExpanded = expandedBrands[brand._id];
                      const visibleVariants = isExpanded ? allVariants : allVariants.slice(0, 3);
                      const hiddenCount = allVariants.length - 3;

                      return (
                        <>
                          {allVariants.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No variants added.</div>
                          ) : (
                            <>
                              {visibleVariants.map((v: any) => (
                                <div key={v._id} className="flex justify-between text-sm">
                                  <span className="text-gray-300">{v.name}</span>
                                  {v.isAvailable ? (
                                    <span className="text-green-400 font-medium">Available</span>
                                  ) : (
                                    <span className="text-red-400 font-medium">Unavailable</span>
                                  )}
                                </div>
                              ))}
                              {hiddenCount > 0 && (
                                <button
                                  onClick={() => setExpandedBrands((prev) => ({ ...prev, [brand._id]: !prev[brand._id] }))}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors pt-2 underline decoration-dashed underline-offset-4"
                                >
                                  {isExpanded ? "Show less" : `+ ${hiddenCount} more variant${hiddenCount !== 1 ? 's' : ''}`}
                                </button>
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
