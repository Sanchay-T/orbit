import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for API key operations");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key);
}

/**
 * Generate a new API key for a user.
 * Returns the plaintext key (shown once) and stores the hash.
 */
export async function generateApiKey(userId: string, name: string) {
  const raw = `orb_live_${randomBytes(24).toString("base64url")}`;
  const hash = createHash("sha256").update(raw).digest("hex");
  const prefix = raw.slice(0, 12);

  const { error } = await getAdminClient().from("api_keys").insert({
    user_id: userId,
    name,
    key_hash: hash,
    key_prefix: prefix,
  });

  if (error) throw new Error(error.message);
  return { key: raw, prefix };
}

/**
 * Validate an API key from the Authorization header.
 * Returns the userId if valid, null otherwise.
 */
export async function validateApiKey(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;

  const key = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!key.startsWith("orb_live_")) return null;

  const hash = createHash("sha256").update(key).digest("hex");

  const { data } = await getAdminClient()
    .from("api_keys")
    .select("user_id")
    .eq("key_hash", hash)
    .single();

  if (!data) return null;

  // Update last_used_at (fire and forget)
  getAdminClient()
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", hash)
    .then(() => {});

  return data.user_id;
}

/**
 * Get auth context from either session cookie OR API key.
 * API routes use this to support both browser and agent access.
 */
export async function getAgentOrSessionAuth(request: Request): Promise<{
  userId: string;
  selfNodeId: string | null;
} | null> {
  // Try API key first
  const authHeader = request.headers.get("authorization");
  const apiKeyUserId = await validateApiKey(authHeader);

  if (apiKeyUserId) {
    const { data: profile } = await getAdminClient()
      .from("profiles")
      .select("self_node_id")
      .eq("id", apiKeyUserId)
      .single();

    return {
      userId: apiKeyUserId,
      selfNodeId: profile?.self_node_id ?? null,
    };
  }

  // Fall back to session auth
  const { getAuthContext } = await import("@/lib/auth");
  const auth = await getAuthContext();
  if (!auth) return null;
  return { userId: auth.userId, selfNodeId: auth.selfNodeId };
}
