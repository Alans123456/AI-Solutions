import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { ArrowLeft, Code2, LogIn, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

type LoginForm = {
  email: string
  password: string
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      await login(data.email, data.password);
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      navigate("/admin")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      console.error("Login error:", message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8df] p-4 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,158,11,0.28),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.76),rgba(250,204,21,0.14))] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(99,102,241,0.16),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.92))]" />
      <div className="absolute inset-0 opacity-[0.24] dark:opacity-[0.18] [background-image:linear-gradient(30deg,rgba(15,23,42,0.30)_12%,transparent_12.5%,transparent_87%,rgba(15,23,42,0.30)_87.5%,rgba(15,23,42,0.30)),linear-gradient(150deg,rgba(15,23,42,0.30)_12%,transparent_12.5%,transparent_87%,rgba(15,23,42,0.30)_87.5%,rgba(15,23,42,0.30)),linear-gradient(30deg,rgba(15,23,42,0.30)_12%,transparent_12.5%,transparent_87%,rgba(15,23,42,0.30)_87.5%,rgba(15,23,42,0.30)),linear-gradient(150deg,rgba(15,23,42,0.30)_12%,transparent_12.5%,transparent_87%,rgba(15,23,42,0.30)_87.5%,rgba(15,23,42,0.30)),linear-gradient(60deg,rgba(245,158,11,0.38)_25%,transparent_25.5%,transparent_75%,rgba(245,158,11,0.38)_75%,rgba(245,158,11,0.38)),linear-gradient(60deg,rgba(245,158,11,0.38)_25%,transparent_25.5%,transparent_75%,rgba(245,158,11,0.38)_75%,rgba(245,158,11,0.38))] [background-position:0_0,0_0,42px_74px,42px_74px,0_0,42px_74px] [background-size:84px_148px]" />
      <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full border border-amber-300/50 bg-amber-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full border border-slate-900/10 bg-slate-900/10 blur-3xl dark:bg-indigo-500/10" />

      <Link to="/" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Button variant="outline" className="rounded-xl border-white/60 bg-white/75 shadow-lg backdrop-blur-xl hover:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Website
        </Button>
      </Link>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border border-white/50 bg-white/78 shadow-2xl shadow-amber-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/76">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-slate-950 dark:to-white" />
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 shadow-lg shadow-amber-500/25">
            <Code2 className="h-7 w-7 text-slate-950" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black">Admin Sign In</CardTitle>
            <CardDescription className="mt-2">
              Secure access for AI Solution administrators
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-slate-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-slate-200">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-amber-600 dark:text-amber-300" />
              <span>Only admin-created accounts can access this dashboard.</span>
            </div>
            <Button type="submit" className="w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200" disabled={loading}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
