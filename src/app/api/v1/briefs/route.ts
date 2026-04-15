import { NextRequest, NextResponse } from "next/server";
import { queryNeo4j } from "@/lib/neo4j";
import { getAgentOrSessionAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/briefs/going-cold?limit=5&days=14
 * Returns contacts that are going cold — high score but stale interactions.
 * This is what agents use to generate reconnect suggestions.
 */
export async function GET(request: NextRequest) {
  const auth = await getAgentOrSessionAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "5"), 50);
  const days = parseInt(request.nextUrl.searchParams.get("days") || "14");

  const rows = await queryNeo4j(auth.userId,
    `MATCH (p:Person {userId: $userId})
     WHERE p.category <> "self"
       AND p.relationship_score >= 5
       AND p.last_interaction_at IS NOT NULL
     RETURN p.id AS id, p.name AS name, p.company AS company, p.category AS category,
            p.relationship_score AS score, p.last_interaction_at AS lastInteractionAt,
            p.email AS email
     ORDER BY p.relationship_score DESC`
  );

  const threshold = days * 24 * 60 * 60 * 1000;
  const cold = rows.filter((r) => {
    try {
      return Date.now() - Date.parse(r.lastInteractionAt as string) > threshold;
    } catch { return false; }
  }).slice(0, limit);

  const contacts = cold.map((r) => ({
    id: r.id,
    name: r.name,
    company: r.company || null,
    category: r.category || "other",
    score: r.score,
    email: r.email || null,
    lastInteractionAt: r.lastInteractionAt,
    daysSinceContact: Math.floor((Date.now() - Date.parse(r.lastInteractionAt as string)) / (24 * 60 * 60 * 1000)),
  }));

  return NextResponse.json({ contacts, count: contacts.length });
}
