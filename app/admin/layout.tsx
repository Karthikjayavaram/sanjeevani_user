"use client"

import { useState } from "react"
import { Wheat, LayoutDashboard, Package, LogOut, Settings, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const closeMenu = () => setIsMobileMenuOpen(false)

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#050505]">{children}</div>
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050505]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/10 z-50">
        <h2 className="text-xl font-playfair font-black text-gradient-gold">Sanjeevini Admin</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-white/10 flex flex-col relative overflow-hidden transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 absolute h-full min-h-screen" : "-translate-x-full absolute h-full min-h-screen hidden md:block"}
        md:relative md:translate-x-0 md:h-auto
      `}>
        {/* Subtle gold glow behind sidebar */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 relative z-10 hidden md:block">
          <h2 className="text-2xl font-playfair font-black text-gradient-gold">Sanjeevini</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 relative z-10">
          <Link href="/admin/brands" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-medium">Edit Stock</span>
          </Link>
          <Link href="/admin/brands/new" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Add New Brand</span>
          </Link>
          <Link href="/admin/variants" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Manage Variants</span>
          </Link>
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white mt-4 border-t border-white/10 pt-4">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-medium">Go to Website</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t border-white/5 relative z-10">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl py-6">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative min-h-screen">
        {/* Background glow for main area */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  )
}
