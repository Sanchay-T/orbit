"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08080c] px-4 relative overflow-hidden">
      <Particles
        className="absolute inset-0 z-0"
        quantity={40}
        color="#7c5cfc"
        size={0.3}
        staticity={50}
      />
      <div className="absolute top-[-30%] left-[30%] w-[500px] h-[500px] rounded-full bg-violet-600/6 blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold shadow-lg shadow-violet-500/20">
            O
          </div>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-100">
            Orbit
          </span>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Sign in to your Orbit account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-zinc-400 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-white/[0.03] border-white/[0.06] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-violet-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-zinc-400 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 bg-white/[0.03] border-white/[0.06] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-violet-500/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-violet-500/20 mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
