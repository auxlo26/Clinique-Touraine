import { NextRequest, NextResponse } from "next/server";
import { appendStore, generateReference } from "@/lib/store";

export const runtime = "nodejs";

const FILE = "contact-messages.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactMessage {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  consent: true;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  let body: Partial<ContactMessage>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { name, email, phone, message, consent } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const entry: ContactMessage = {
    reference: generateReference("MSG"),
    name,
    email,
    phone: phone ?? "",
    message,
    consent: true,
    createdAt: new Date().toISOString(),
  };

  await appendStore<ContactMessage>(FILE, entry);
  return NextResponse.json({ ok: true }, { status: 201 });
}
