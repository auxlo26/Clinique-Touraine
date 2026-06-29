import { NextRequest, NextResponse } from "next/server";
import { appendStore, generateReference, readStore } from "@/lib/store";
import type { CallbackRequest } from "@/lib/types";

export const runtime = "nodejs";

const FILE = "callbacks.json";

export async function GET() {
  const callbacks = await readStore<CallbackRequest>(FILE);
  return NextResponse.json({ callbacks });
}

export async function POST(req: NextRequest) {
  let body: Partial<CallbackRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { name, phone, reason, isEmergency } = body;
  if (!name || !phone || !reason) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const callback: CallbackRequest = {
    reference: generateReference("RAP"),
    name,
    phone,
    reason,
    isEmergency: Boolean(isEmergency),
    createdAt: new Date().toISOString(),
  };

  await appendStore<CallbackRequest>(FILE, callback);
  return NextResponse.json({ callback }, { status: 201 });
}
