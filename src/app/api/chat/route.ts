import { NextRequest, NextResponse } from "next/server";
import { isOpenNow } from "@/config/clinic";
import { buildSystemPrompt } from "@/lib/assistant/systemPrompt";
import { getFallbackReply } from "@/lib/assistant/fallback";
import type { Locale } from "@/i18n/LocaleProvider";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  locale: Locale;
}

const MODEL = "claude-sonnet-4-6";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, locale } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }
  const safeLocale: Locale = locale === "en" ? "en" : "fr";
  const openState = isOpenNow();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const reply = getFallbackReply(lastUserMessage?.content ?? "", safeLocale, openState);
    return NextResponse.json({ reply, source: "fallback" });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: buildSystemPrompt(safeLocale, openState),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      const reply = getFallbackReply(lastUserMessage?.content ?? "", safeLocale, openState);
      return NextResponse.json({ reply, source: "fallback-error" });
    }

    const data = await response.json();
    const text =
      Array.isArray(data.content) && data.content[0]?.type === "text"
        ? data.content[0].text
        : safeLocale === "fr"
          ? "Désolé, je n'ai pas pu générer de réponse."
          : "Sorry, I could not generate a reply.";

    return NextResponse.json({ reply: text, source: "anthropic" });
  } catch {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const reply = getFallbackReply(lastUserMessage?.content ?? "", safeLocale, openState);
    return NextResponse.json({ reply, source: "fallback-error" });
  }
}
