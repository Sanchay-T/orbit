import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/keys — list user's API keys (prefix only, no secrets)
 */
export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, created_at")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: keys ?? [] });
}

/**
 * POST /api/keys — generate a new API key
 * Returns the plaintext key ONCE. User must save it.
 */
export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = body.name || "Untitled key";

  const { key, prefix } = await generateApiKey(auth.userId, name);

  return NextResponse.json({
    key, // shown once, never stored
    prefix,
    name,
    message: "Save this key — you won't be able to see it again.",
  });
}
