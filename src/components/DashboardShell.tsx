"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Particles } from "@/components/ui/particles";

interface DashboardShellProps {
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export function DashboardShell({ user }: DashboardShellProps) {
  const router = useRouter();
  const supabase = createClient();

  // Initialize self-node on first visit
  useEffect(() => {
    fetch("/api/init", { method: "POST" }).catch(() => {});
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#08080c] text-zinc-50 flex flex-col relative overflow-hidden">
      {/* Subtle background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={30}
        color="#7c5cfc"
        size={0.3}
        staticity={60}
      />

      {/* TopBar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold shadow-lg shadow-violet-500/15">
            O
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-200">
            Orbit
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none cursor-pointer hover:ring-2 hover:ring-violet-500/30 transition-all">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[11px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-[#12121a] border-white/[0.06]"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-zinc-200">
                {user.displayName}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-zinc-400 focus:text-zinc-50 focus:bg-white/[0.04] cursor-pointer text-sm"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main content — empty state */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative w-20 h-20 mx-auto mb-8">
            {/* Orbital ring animation */}
            <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-spin" style={{ animationDuration: "8s" }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,92,252,0.5)]" />
            </div>
            <div className="absolute inset-3 rounded-full border border-indigo-500/10 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }}>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(124,92,252,0.4)]" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold tracking-[-0.02em] text-zinc-100 mb-2">
            Your constellation awaits
          </h2>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            Add contacts or connect a data source to see your relationship graph come to life.
          </p>
          <Button
            variant="outline"
            className="border-white/[0.08] text-zinc-300 hover:bg-white/[0.04] hover:border-violet-500/20 transition-all"
            disabled
          >
            Coming soon: Add contacts
          </Button>
        </div>
      </main>

      {/* BottomBar */}
      <footer className="relative z-10 flex items-center justify-between px-6 py-2.5 border-t border-white/[0.04] text-xs text-zinc-600">
        <div className="flex items-center gap-5">
          <span>0 People</span>
          <span>0 Connections</span>
          <span>0 Going Cold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 opacity-50" />
          <span>Orbit</span>
        </div>
      </footer>
    </div>
  );
}
