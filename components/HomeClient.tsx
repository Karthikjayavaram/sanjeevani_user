"use client"

import React, { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowDown, ChevronRight } from "lucide-react"

// A simple magnetic button wrapper using Framer Motion
function MagneticButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

// Simple floating particles effect
function Particles() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      animX: Math.random() * 50 - 25,
    }));
    setParticles(generatedParticles);
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" />;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/40 shadow-[0_0_10px_2px_rgba(212,175,55,0.3)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, p.animX, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20 bg-[#050505]">
      {/* Particles */}
      <Particles />

      {/* Subtle luxury glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-sm font-medium tracking-widest uppercase mb-6">
            Establishment of Excellence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4 text-gradient-gold drop-shadow-2xl"
        >
          Sanjeevini
          <br />
          Veeresh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light tracking-wide mb-12"
        >
          Premium Rice Brands & Warehouse Stock
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <MagneticButton>
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(212,175,55,0.6)]">
              <Link href="/#brands">
                Explore Inventory <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-primary opacity-70" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
