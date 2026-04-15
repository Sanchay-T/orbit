import { NextRequest, NextResponse } from "next/server";
import { queryNeo4j } from "@/lib/neo4j";
import { getAgentOrSessionAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/persons?q=<query>&limit=25
 * Search persons by name or company. Used by agents for person lookup.
 */
export async function GET(request: NextRequest) {
  const auth = await getAgentOrSessionAuth(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q") || "";
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "25"), 100);
  const category = request.nextUrl.searchParams.get("category");

  let cypher: string;
  const params: Record<string, unknown> = {};

  if (q) {
    cypher = `MATCH (p:Person {userId: $userId}) WHERE p.category <> "self"
      AND (toLower(p.name) CONTAINS toLower($query) OR toLower(COALESCE(p.company, "")) CONTAINS toLower($query))
      ${category ? 'AND p.category = $category' : ''}
      RETURN p.id AS id, p.name AS name, p.company AS company, p.email AS email,
             p.category AS category, p.relationship_score AS score, p.last_interaction_at AS lastInteractionAt
      ORDER BY p.relationship_score DESC LIMIT ${limit}`;
    params.query = q;
  } else {
    cypher = `MATCH (p:Person {userId: $userId}) WHERE p.category <> "self"
      ${category ? 'AND p.category = $category' : ''}
      RETURN p.id AS id, p.name AS name, p.company AS company, p.email AS email,
             p.category AS category, p.relationship_score AS score, p.last_interaction_at AS lastInteractionAt
      ORDER BY p.relationship_score DESC LIMIT ${limit}`;
  }

  if (category) params.category = category;

  const rows = await queryNeo4j(auth.userId, cypher, params);

  const persons = rows.map((r) => ({
    id: r.id as string,
    name: (r.name as string) || (r.id as string),
    company: (r.company as string) || null,
    email: (r.email as string) || null,
    category: (r.category as string) || "other",
    score: typeof r.score === "number" ? r.score : 0,
    lastInteractionAt: (r.lastInteractionAt as string) || null,
  }));

  return NextResponse.json({ persons, count: persons.length });
}
