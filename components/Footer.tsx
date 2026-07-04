"use client"

import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 py-12 md:py-16 bg-black relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Brand & Godown Details */}
          <div className="space-y-4">
            <h3 className="text-2xl font-playfair font-bold text-gradient-gold">Sanjeevini Veeresh</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Premium Rice Godown offering the finest quality rice brands with reliable stock availability.
            </p>
            <div className="pt-2 space-y-2 text-sm text-foreground/80">
              <p className="flex items-center gap-2">
                <span className="text-primary font-medium">Location:</span> Siruguppa, Karnataka, India
              </p>
              <p className="flex items-center gap-2">
                {/* Phone number removed */}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/#brands" className="hover:text-primary transition-colors">Our Stock</a></li>
              <li><a href="/admin/login" className="hover:text-primary transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          {/* Developer Details */}
          <div className="space-y-4 lg:text-right">
            <h3 className="text-lg font-semibold text-foreground">Web Development</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For premium web services, e-commerce, or stock management systems like this:
            </p>
            <div className="pt-2 space-y-2 text-sm text-foreground/80 lg:flex lg:flex-col lg:items-end">
              <p className="font-medium text-primary text-base">Karthik Jayavaram</p>
              <p className="flex items-center gap-2 lg:justify-end">
                {/* Phone number removed */}
              </p>
              <p className="flex items-center gap-2 lg:justify-end">
                <span className="text-muted-foreground">Email:</span> karthik.jayavaram@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Sanjeevini Veeresh Rice Godown. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Designed & Developed by <span className="text-primary font-medium">Karthik Jayavaram</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
