"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, Warehouse, Leaf } from "lucide-react"

const features = [
  {
    icon: <Warehouse className="w-8 h-8 text-primary" />,
    title: "Vast Storage Capacity",
    description: "Our state-of-the-art godown ensures optimal conditions for rice preservation, maintaining aroma and texture."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Premium Quality Assurance",
    description: "Every batch is rigorously tested. We only stock grades that meet our uncompromising standards of excellence."
  },
  {
    icon: <Truck className="w-8 h-8 text-primary" />,
    title: "Efficient Distribution",
    description: "Strategically located for seamless logistics, guaranteeing timely fulfillment for bulk orders."
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Pesticide-Free Selection",
    description: "We prioritize organic and naturally farmed rice brands to promote health and sustainability."
  }
]

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  }

  return (
    <section className="py-32 relative bg-black overflow-hidden z-10">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gradient-gold inline-block"
          >
            The Gold Standard of Rice
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Sanjeevani Veeresh has redefined warehouse standards. We provide unparalleled quality and reliability for premium rice distribution.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants as any}
              className="glass-dark p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 group relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
