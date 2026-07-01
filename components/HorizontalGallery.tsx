"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const galleryImages = [
  "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626545183307-5e6df7dbccf6?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532087593674-83955620b793?q=80&w=2070&auto=format&fit=crop",
]

export default function HorizontalGallery() {
  const targetRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Move the gallery horizontally based on scroll
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-70%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 absolute top-20 left-0 w-full z-10">
          <h2 className="font-playfair text-5xl md:text-7xl font-bold text-gradient-gold">
            Inside the Godown
          </h2>
          <p className="text-muted-foreground mt-4 text-xl">A glimpse into our premium storage facilities.</p>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-4 mt-32">
          {galleryImages.map((src, index) => (
            <div 
              key={index}
              className="relative w-[80vw] md:w-[50vw] lg:w-[40vw] h-[50vh] md:h-[60vh] shrink-0 rounded-3xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={src} 
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
