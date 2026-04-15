"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
      <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/6 blur-[120px]" />

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

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                Check your email
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                We sent a confirmation link to{" "}
                <span className="text-zinc-300">{email}</span>
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]"
                >
                  Back to login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100 mb-1">
                  Create your account
                </h1>
                <p className="text-sm text-zinc-500">
                  Start mapping your relationship universe
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs text-zinc-400 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 bg-white/[0.03] border-white/[0.06] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-violet-500/20"
                  />
                </div>
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
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-10 bg-white/[0.03] border-white/[0.06] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-violet-500/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-violet-500/20 mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="text-center text-sm text-zinc-500 mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
