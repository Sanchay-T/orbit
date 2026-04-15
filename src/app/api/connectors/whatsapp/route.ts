import { NextRequest, NextResponse } from "next/server";
import { writeNeo4j, queryNeo4j } from "@/lib/neo4j";
import { getAuthContext } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// WhatsApp chat export line pattern:
// [DD/MM/YYYY, HH:MM:SS] Sender Name: message
// or: DD/MM/YYYY, HH:MM - Sender Name: message
const LINE_PATTERN = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]?\s*[-–]\s*(.+?):\s(.+)$/;

interface ParsedMessage {
  date: string;
  sender: string;
  message: string;
}

function parseWhatsAppExport(text: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const match = line.match(LINE_PATTERN);
    if (!match) continue;

    const [, datePart, timePart, sender, message] = match;
    // Skip system messages
    if (sender.includes("created this group") || sender.includes("changed the")) continue;
    if (message === "<Media omitted>" || message === "This message was deleted") continue;

    messages.push({
      date: `${datePart} ${timePart}`,
      sender: sender.trim(),
      message: message.trim(),
    });
  }

  return messages;
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { chatExport, filename } = body;

  if (!chatExport || typeof chatExport !== "string") {
    return NextResponse.json({ error: "No chat export provided" }, { status: 400 });
  }

  const { userId, selfNodeId } = auth;
  if (!selfNodeId) {
    return NextResponse.json({ error: "Please initialize your account first" }, { status: 400 });
  }

  const messages = parseWhatsAppExport(chatExport);
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages found in export. Make sure it's a WhatsApp chat export .txt file." }, { status: 400 });
  }

  // Group by sender to create Person nodes
  const senderMessages = new Map<string, ParsedMessage[]>();
  for (const msg of messages) {
    const existing = senderMessages.get(msg.sender) || [];
    existing.push(msg);
    senderMessages.set(msg.sender, existing);
  }

  let contactsCreated = 0;
  let interactionsCreated = 0;

  for (const [sender, msgs] of senderMessages) {
    // Check if person already exists by name
    const existing = await queryNeo4j(userId,
      `MATCH (p:Person {userId: $userId}) WHERE toLower(p.name) = toLower($name) RETURN p.id AS id LIMIT 1`,
      { name: sender }
    );

    let personId: string;

    if (existing.length > 0) {
      personId = existing[0].id as string;
    } else {
      personId = `wa_${crypto.randomUUID().slice(0, 8)}`;
      await writeNeo4j(userId,
        `CREATE (p:Person {
          id: $personId,
          userId: $userId,
          name: $name,
          category: "other",
          relationship_score: $score,
          source: "whatsapp"
        })`,
        {
          personId,
          name: sender,
          score: Math.min(10, Math.log2(msgs.length + 1) * 2),
        }
      );
      contactsCreated++;
    }

    // Create INTERACTED edges (batch — one per conversation chunk, not per message)
    // Group messages by date to create daily interaction summaries
    const byDate = new Map<string, ParsedMessage[]>();
    for (const msg of msgs) {
      const dateKey = msg.date.split(",")[0]?.split(" ")[0] || "unknown";
      const existing = byDate.get(dateKey) || [];
      existing.push(msg);
      byDate.set(dateKey, existing);
    }

    for (const [dateKey, dayMsgs] of byDate) {
      const summary = dayMsgs.length === 1
        ? dayMsgs[0].message.slice(0, 200)
        : `${dayMsgs.length} messages exchanged`;

      await writeNeo4j(userId,
        `MATCH (a:Person {id: $selfNodeId, userId: $userId}), (b:Person {id: $personId, userId: $userId})
         CREATE (a)-[:INTERACTED {
           channel: "whatsapp",
           timestamp: $timestamp,
           direction: "both",
           summary: $summary,
           message_count: $count
         }]->(b)`,
        {
          selfNodeId,
          personId,
          timestamp: dateKey,
          summary,
          count: dayMsgs.length,
        }
      );
      interactionsCreated++;
    }

    // Update last_interaction_at on the person
    await writeNeo4j(userId,
      `MATCH (p:Person {id: $personId, userId: $userId})
       SET p.last_interaction_at = datetime().epochMillis`,
      { personId }
    );
  }

  // Record connector
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
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

  await supabase.from("connectors").upsert({
    user_id: userId,
    provider: "whatsapp",
    status: "active",
    last_sync_at: new Date().toISOString(),
    contacts_synced: contactsCreated,
    metadata: { filename, totalMessages: messages.length },
  }, { onConflict: "user_id,provider" });

  return NextResponse.json({
    contacts: contactsCreated,
    interactions: interactionsCreated,
    totalMessages: messages.length,
  });
}
