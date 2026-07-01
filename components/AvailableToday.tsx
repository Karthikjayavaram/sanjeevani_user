"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion"
import { useRef } from "react"

function Counter({ from, to }: { from: number, to: number }) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" })
      return controls.stop
    }
  }, [count, to, isInView])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

export default function AvailableToday({ totalBags, totalBrands }: { totalBags: number, totalBrands: number }) {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-around items-center gap-12">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-black font-playfair text-gradient-gold mb-2">
              <Counter from={0} to={totalBags} />+
            </div>
            <div className="text-xl text-muted-foreground uppercase tracking-widest">Bags in Stock</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-black font-playfair text-gradient-gold mb-2">
              <Counter from={0} to={totalBrands} />
            </div>
            <div className="text-xl text-muted-foreground uppercase tracking-widest">Premium Brands</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-black font-playfair text-gradient-gold mb-2">
              <Counter from={0} to={100} />%
            </div>
            <div className="text-xl text-muted-foreground uppercase tracking-widest">Quality Guarantee</div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
