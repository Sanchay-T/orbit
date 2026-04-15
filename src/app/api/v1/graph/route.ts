import { NextRequest, NextResponse } from "next/server";
import { queryNeo4j } from "@/lib/neo4j";
import { getAgentOrSessionAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/graph/stats
 * High-level graph statistics for the authenticated user.
 */
export async function GET(request: NextRequest) {
  const auth = await getAgentOrSessionAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalRows, warmRows, coldRows, edgeRows] = await Promise.all([
    queryNeo4j(auth.userId, `MATCH (p:Person {userId: $userId}) WHERE p.category <> "self" RETURN count(p) AS count`),
    queryNeo4j(auth.userId, `MATCH (p:Person {userId: $userId}) WHERE p.relationship_score >= 5 AND p.category <> "self" RETURN count(p) AS count`),
    queryNeo4j(auth.userId, `MATCH (p:Person {userId: $userId}) WHERE p.relationship_score >= 5 AND p.category <> "self" RETURN p.last_interaction_at AS ts, p.relationship_score AS score`),
    queryNeo4j(auth.userId, `MATCH (a:Person {userId: $userId})-[r:INTERACTED]-(b:Person {userId: $userId}) RETURN count(r) AS count`),
  ]);

  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  const goingCold = (coldRows as Array<{ ts: unknown; score: unknown }>).filter((r) => {
    if (!r.ts || (r.score as number) <= 5) return false;
    try { return Date.now() - Date.parse(r.ts as string) > fourteenDays; } catch { return false; }
  }).length;

  return NextResponse.json({
    totalPeople: (totalRows[0] as { count: number })?.count ?? 0,
    warmContacts: (warmRows[0] as { count: number })?.count ?? 0,
    goingCold,
    totalInteractions: (edgeRows[0] as { count: number })?.count ?? 0,
  });
}
