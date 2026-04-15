"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextAnimate } from "@/components/ui/text-animate";
import { BorderBeam } from "@/components/ui/border-beam";
import { useEffect, useState } from "react";

const FEATURES = [
  {
    title: "Constellation Graph",
    description:
      "Your entire network visualized as an interactive star map. High-value contacts shine brightest.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Intro Path Finder",
    description:
      "Discover the warmest path to anyone through your existing connections. Two hops, ranked by strength.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "Going Cold Alerts",
    description:
      "Never lose touch with key contacts. Orbit flags relationships that are fading before it's too late.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    title: "Network Intelligence",
    description:
      "Surface blind spots, super-connectors, and concentration risks across your entire relationship graph.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Topic Resonance",
    description:
      "See what you and each contact talk about most. Find the people who share your passions.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
      </svg>
    ),
  },
  {
    title: "Meeting Briefs",
    description:
      "Before every meeting, get a brief on who you're meeting: shared history, topics, and suggested talking points.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#08080c] text-zinc-50 overflow-hidden">
      {/* Particles background */}
      {mounted && (
        <Particles
          className="fixed inset-0 z-0"
          quantity={80}
          color="#7c5cfc"
          size={0.4}
          staticity={40}
          ease={60}
        />
      )}

      {/* Gradient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/6 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold shadow-lg shadow-violet-500/20">
            O
          </div>
          <span className="text-[17px] font-semibold tracking-[-0.02em]">Orbit</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-zinc-50 text-sm font-medium"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <ShimmerButton
              className="h-9 px-5 text-sm font-medium"
              shimmerColor="#7c5cfc"
              shimmerSize="0.08em"
              background="rgba(124, 92, 252, 0.15)"
              borderRadius="8px"
            >
              Get started
            </ShimmerButton>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-32 max-w-5xl mx-auto">
        {/* Pill badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-[13px] text-violet-300/90 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Relationship Intelligence Platform
        </div>

        {/* Headline — Instrument Serif for the italic emphasis */}
        <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[1.05] mb-7">
          <TextAnimate animation="blurInUp" by="word" delay={0.04}>
            Your network is your
          </TextAnimate>
          <br />
          <span className="font-[family-name:var(--font-serif)] italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
            net worth
          </span>
        </h1>

        {/* Subline */}
        <p className="text-lg text-zinc-400/90 max-w-xl mb-11 leading-relaxed font-light tracking-[-0.01em]">
          Orbit maps every relationship into a living constellation — surfacing warm intros,
          fading connections, and hidden intelligence across your network.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup">
            <ShimmerButton
              className="h-12 px-8 text-[15px] font-medium"
              shimmerColor="#a78bfa"
              shimmerSize="0.06em"
              background="linear-gradient(135deg, #7c5cfc 0%, #6d4de8 100%)"
              borderRadius="10px"
            >
              Start for free
            </ShimmerButton>
          </Link>
          <span className="text-[13px] text-zinc-500">No credit card required</span>
        </div>
      </section>

      {/* Preview card — dashboard mockup */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-sm overflow-hidden">
          <BorderBeam
            size={200}
            duration={12}
            colorFrom="#7c5cfc"
            colorTo="#6366f1"
          />
          <div className="rounded-lg bg-[#0c0c14] p-8 min-h-[320px] flex items-center justify-center">
            {/* Simulated constellation preview */}
            <div className="relative w-full max-w-lg aspect-square">
              {/* Center node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-violet-500 shadow-[0_0_30px_rgba(124,92,252,0.4)]" />
              {/* Orbiting nodes */}
              {[
                { x: "25%", y: "30%", size: "10px", color: "#3B82F6", delay: "0s" },
                { x: "70%", y: "25%", size: "8px", color: "#22C55E", delay: "0.5s" },
                { x: "80%", y: "55%", size: "12px", color: "#EC4899", delay: "1s" },
                { x: "35%", y: "75%", size: "9px", color: "#EAB308", delay: "0.3s" },
                { x: "15%", y: "55%", size: "7px", color: "#06B6D4", delay: "0.7s" },
                { x: "55%", y: "15%", size: "6px", color: "#8B5CF6", delay: "1.2s" },
                { x: "60%", y: "70%", size: "11px", color: "#F97316", delay: "0.9s" },
                { x: "45%", y: "85%", size: "5px", color: "#14B8A6", delay: "1.5s" },
              ].map((node, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.size,
                    height: node.size,
                    backgroundColor: node.color,
                    boxShadow: `0 0 20px ${node.color}40`,
                    animationDelay: node.delay,
                    animationDuration: "3s",
                  }}
                />
              ))}
              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {[
                  ["50%", "50%", "25%", "30%"],
                  ["50%", "50%", "70%", "25%"],
                  ["50%", "50%", "80%", "55%"],
                  ["50%", "50%", "35%", "75%"],
                  ["50%", "50%", "15%", "55%"],
                  ["50%", "50%", "55%", "15%"],
                  ["50%", "50%", "60%", "70%"],
                  ["25%", "30%", "55%", "15%"],
                  ["70%", "25%", "80%", "55%"],
                  ["35%", "75%", "60%", "70%"],
                ].map(([x1, y1, x2, y2], i) => (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(124, 92, 252, 0.15)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
              <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-600">
                Your constellation — powered by your real data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-[-0.03em] mb-4">
            Intelligence, not just{" "}
            <span className="font-[family-name:var(--font-serif)] italic text-violet-400">
              contacts
            </span>
          </h2>
          <p className="text-zinc-500 text-base max-w-lg mx-auto">
            Orbit doesn&apos;t just store names. It understands the topology of your relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 hover:border-violet-500/20 hover:bg-violet-500/[0.03] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500/15 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-[15px] font-semibold mb-2 tracking-[-0.01em]">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold tracking-[-0.03em] mb-4">
          Ready to see your network clearly?
        </h2>
        <p className="text-zinc-500 mb-8">
          Join the founders who use Orbit to maintain and grow their most important relationships.
        </p>
        <Link href="/signup">
          <ShimmerButton
            className="h-11 px-7 text-sm font-medium mx-auto"
            shimmerColor="#a78bfa"
            shimmerSize="0.06em"
            background="linear-gradient(135deg, #7c5cfc 0%, #6d4de8 100%)"
            borderRadius="10px"
          >
            Get started for free
          </ShimmerButton>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center text-sm text-zinc-600">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />
          <span>Orbit</span>
        </div>
      </footer>
    </div>
  );
}
