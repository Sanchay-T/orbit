import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/debug — diagnostic endpoint (TEMPORARY — remove after fixing)
 * Reports env var presence and lengths without exposing values.
 */
export async function GET() {
  const vars = ["NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD", "NEO4J_DATABASE",
    "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  const report: Record<string, unknown> = {};
  for (const name of vars) {
    const val = process.env[name];
    if (val === undefined) {
      report[name] = { present: false };
    } else {
      const trimmed = val.trim();
      report[name] = {
        present: true,
        length: val.length,
        trimmedLength: trimmed.length,
        hasTrailingWhitespace: val.length !== trimmed.length,
        first4: val.slice(0, 4),
        last4: val.slice(-4),
        // Check for newlines or carriage returns
        hasNewline: val.includes("\n"),
        hasCR: val.includes("\r"),
      };
    }
  }

  // Also try a direct Neo4j connection test
  let neo4jTest = "not attempted";
  try {
    const neo4j = (await import("neo4j-driver")).default;
    const uri = (process.env.NEO4J_URI || "").trim();
    const user = (process.env.NEO4J_USER || "").trim();
    const password = (process.env.NEO4J_PASSWORD || "").trim();

    const testDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = testDriver.session({ database: (process.env.NEO4J_DATABASE || "").trim() });
    const result = await session.run("RETURN 1 AS n");
    neo4jTest = `success: ${result.records[0].get("n")}`;
    await session.close();
    await testDriver.close();
  } catch (e) {
    neo4jTest = `failed: ${String(e).slice(0, 300)}`;
  }

  return NextResponse.json({ envVars: report, neo4jTest, runtime: process.version });
}
