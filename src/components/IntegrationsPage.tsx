"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Connector {
  id: string;
  provider: string;
  status: string;
  last_sync_at: string | null;
  contacts_synced: number;
}

const CONNECTORS = [
  {
    id: "google",
    name: "Google",
    description: "Calendar, Contacts, and Gmail. Import meetings, people, and email interactions.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    available: true,
    comingSoon: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Export",
    description: "Upload your WhatsApp chat exports. We parse messages into relationship edges.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    available: true,
    comingSoon: false,
  },
  {
    id: "csv",
    name: "CSV / vCard",
    description: "Import contacts from any CSV or vCard file. Map columns to Orbit fields.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0l1.5 1.5m-1.5-1.5l1.5-1.5M5.625 21h12.75c.621 0 1.125-.504 1.125-1.125V8.394a3.375 3.375 0 00-.988-2.386l-3.02-3.02A3.375 3.375 0 0013.606 2H5.625C5.004 2 4.5 2.504 4.5 3.125v16.75c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    available: true,
    comingSoon: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Import DMs and channel interactions as relationship signals.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z" />
        <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z" />
        <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.528 2.528 0 01-2.52-2.521V2.522A2.528 2.528 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312z" />
        <path fill="#ECB22E" d="M15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.528 2.528 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.528 2.528 0 01-2.52-2.523 2.528 2.528 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z" />
      </svg>
    ),
    available: false,
    comingSoon: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Import your LinkedIn connections and interaction history.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    available: false,
    comingSoon: true,
  },
];

interface IntegrationsPageProps {
  connectors: Connector[];
}

export function IntegrationsPage({ connectors }: IntegrationsPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const connectedProviders = new Set(connectors.filter((c) => c.status === "active").map((c) => c.provider));

  function getConnector(provider: string) {
    return connectors.find((c) => c.provider === provider);
  }

  async function handleWhatsAppUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const text = await file.text();
    const res = await fetch("/api/connectors/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatExport: text, filename: file.name }),
    });

    const data = await res.json();
    if (res.ok) {
      setUploadResult(`Imported ${data.contacts} contacts and ${data.interactions} interactions`);
      router.refresh();
    } else {
      setUploadResult(data.error || "Import failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-200 h-8 px-2 text-[13px]">
              &larr; Dashboard
            </Button>
          </Link>
          <h1 className="text-[16px] font-semibold tracking-[-0.02em]">Integrations</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-[14px] text-zinc-500 mb-8">
          Connect your data sources. Orbit ingests your interactions and builds your relationship graph automatically.
        </p>

        <div className="space-y-3">
          {CONNECTORS.map((conn) => {
            const linked = connectedProviders.has(conn.id);
            const connData = getConnector(conn.id);

            return (
              <div
                key={conn.id}
                className="flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 hover:border-zinc-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center shrink-0">
                  {conn.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-medium text-zinc-200">{conn.name}</h3>
                    {conn.comingSoon && (
                      <span className="text-[10px] uppercase tracking-wide text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                    {linked && (
                      <span className="text-[10px] uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-zinc-500 mt-0.5">{conn.description}</p>
                  {connData?.last_sync_at && (
                    <p className="text-[11px] text-zinc-600 mt-1">
                      Last sync: {new Date(connData.last_sync_at).toLocaleDateString()} &middot; {connData.contacts_synced} contacts
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {conn.id === "whatsapp" && conn.available ? (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.zip"
                        className="hidden"
                        onChange={handleWhatsAppUpload}
                      />
                      <Button
                        variant="outline"
                        className="h-8 text-[12px] border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? "Importing..." : "Upload Export"}
                      </Button>
                    </>
                  ) : conn.id === "google" && conn.available ? (
                    <Button
                      className="h-8 text-[12px] bg-white text-black hover:bg-zinc-200"
                      disabled={linked}
                      onClick={() => {
                        window.location.href = "/api/connectors/google/callback";
                      }}
                    >
                      {linked ? "Connected" : "Connect"}
                    </Button>
                  ) : conn.id === "csv" && conn.available ? (
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="h-8 text-[12px] border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Use + Add
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-8 text-[12px] border-zinc-800 text-zinc-600"
                      disabled
                    >
                      Coming soon
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {uploadResult && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-[13px] text-zinc-400">
            {uploadResult}
          </div>
        )}
      </div>
    </div>
  );
}
