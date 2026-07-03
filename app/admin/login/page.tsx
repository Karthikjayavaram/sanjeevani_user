"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wheat, Loader2, ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  
  // Forgot Password States
  const [mode, setMode] = useState<"login" | "forgot_password" | "reset_password">("login")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push("/admin/brands")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError("")
    setSuccess("")
    if (mode === "reset_password") {
      setResending(true)
    } else {
      setLoading(true)
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || "OTP sent successfully")
        setMode("reset_password")
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
      setResending(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Password reset successfully. You can now log in.")
        setMode("login")
        setPassword("")
        setOtp("")
        setNewPassword("")
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Background glow for main area */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-md animate-pulse"></div>
            <Wheat className="h-10 w-10 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          </div>
          <h1 className="text-4xl font-playfair font-black text-gradient-gold tracking-wider">
            {mode === "login" && "Sanjeevani"}
            {mode === "forgot_password" && "Reset Access"}
            {mode === "reset_password" && "New Password"}
          </h1>
          <p className="text-muted-foreground mt-3 font-light tracking-wide text-sm">
            {mode === "login" && "Secure Admin Portal"}
            {mode === "forgot_password" && "Enter your email to receive an OTP"}
            {mode === "reset_password" && "Check your email for the 6-digit OTP"}
          </p>
        </div>

        <div className="glass-dark rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(212,175,55,0.05)] border border-white/10 relative overflow-hidden">
          {/* Subtle gold glow behind card */}
          <div className="absolute -top-1/2 -right-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {/* LOGIN MODE */}
            {mode === "login" && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-6 relative z-10"
              >
                {error && (
                  <div className="bg-destructive/20 text-red-400 text-sm p-4 rounded-xl border border-destructive/30 backdrop-blur-md">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/20 text-green-400 text-sm p-4 rounded-xl border border-green-500/30 backdrop-blur-md">
                    {success}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-primary/80">Email / Username</label>
                  <Input 
                    type="text" 
                    required 
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="h-14 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    placeholder="Enter your email or username"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-widest text-primary/80">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setMode("forgot_password"); setError(""); setSuccess(""); }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors underline decoration-dashed underline-offset-4"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      className="h-14 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/50 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Portal"
                  )}
                </Button>
              </motion.form>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === "forgot_password" && (
              <motion.form 
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleForgotPassword} 
                className="space-y-6 relative z-10"
              >
                {error && (
                  <div className="bg-destructive/20 text-red-400 text-sm p-4 rounded-xl border border-destructive/30 backdrop-blur-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-primary/80">Email / Username</label>
                  <Input 
                    type="text" 
                    required 
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="h-14 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    placeholder="Enter your email or username"
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Dispatching OTP...
                    </>
                  ) : (
                    "Send Reset OTP"
                  )}
                </Button>
                <div className="text-center mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Return to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* RESET PASSWORD MODE */}
            {mode === "reset_password" && (
              <motion.form 
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleResetPassword} 
                className="space-y-6 relative z-10"
              >
                {error && (
                  <div className="bg-destructive/20 text-red-400 text-sm p-4 rounded-xl border border-destructive/30 backdrop-blur-md">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/20 text-green-400 text-sm p-4 rounded-xl border border-green-500/30 backdrop-blur-md">
                    {success}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-widest text-primary/80">6-Digit OTP</label>
                    <button 
                      type="button"
                      onClick={() => handleForgotPassword()}
                      disabled={resending}
                      className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center disabled:opacity-50"
                    >
                      {resending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Resend OTP
                    </button>
                  </div>
                  <Input 
                    type="text" 
                    required 
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    className="h-14 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-xl placeholder:text-muted-foreground/30 placeholder:tracking-normal"
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-primary/80">New Password</label>
                  <div className="relative">
                    <Input 
                      type={showNewPassword ? "text" : "password"} 
                      required 
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      className="h-14 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all placeholder:text-muted-foreground/50 pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Security...
                    </>
                  ) : (
                    "Confirm Reset"
                  )}
                </Button>
                <div className="text-center mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Reset
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
