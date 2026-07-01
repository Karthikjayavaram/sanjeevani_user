"use client"

import { Wheat, LayoutDashboard, Package, LogOut, Settings, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-black border-r border-white/10 flex flex-col relative overflow-hidden">
        {/* Subtle gold glow behind sidebar */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 relative z-10">
          <h2 className="text-2xl font-playfair font-black text-gradient-gold">Sanjeevani</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 relative z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/brands" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-medium">Inventory</span>
          </Link>
          <Link href="/admin/brands/new" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Add Stock</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white mt-4 border-t border-white/10 pt-4">
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
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        {/* Background glow for main area */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  )
}
