"use client"

import { motion } from "framer-motion"

export default function BrandDetailsClient({ variants }: { variants: any[] }) {
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  if (!variants || variants.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl text-center">
        <p className="text-muted-foreground">No variant information available for this brand.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="grid grid-cols-3 p-4 bg-muted/50 font-semibold border-b">
        <div className="col-span-2">Variant Name</div>
        <div className="text-right">Available Stock</div>
      </div>
      <motion.ul 
        variants={container}
        initial="hidden"
        animate="show"
        className="divide-y"
      >
        {variants.map((variant) => (
          <motion.li 
            key={variant._id} 
            variants={item}
            className="grid grid-cols-3 p-4 items-center hover:bg-muted/20 transition-colors"
          >
            <div className="col-span-2 font-medium flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${variant.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
              {variant.name}
            </div>
            <div className="text-right">
              {variant.stockQuantity > 0 ? (
                <span className="font-bold text-foreground">{variant.stockQuantity}</span>
              ) : (
                <span className="text-muted-foreground text-sm">Out of Stock</span>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
