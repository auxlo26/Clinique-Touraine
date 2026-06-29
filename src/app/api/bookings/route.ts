import { NextRequest, NextResponse } from "next/server";
import { appendStore, generateReference, readStore } from "@/lib/store";
import type { Booking } from "@/lib/types";
import { slotsForDate } from "@/config/clinic";

export const runtime = "nodejs";

const FILE = "bookings.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const bookings = await readStore<Booking>(FILE);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  let body: Partial<Booking>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { service, animal, date, time, name, phone, email, notes, consent } = body;

  if (!service || !animal || !date || !time || !name || !phone || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }
  const validSlots = slotsForDate(parsedDate);
  if (!validSlots.includes(time)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }

  const booking: Booking = {
    reference: generateReference("RDV"),
    service,
    animal,
    date,
    time,
    name,
    phone,
    email,
    notes: notes ?? "",
    consent: true,
    createdAt: new Date().toISOString(),
  };

  await appendStore<Booking>(FILE, booking);
  return NextResponse.json({ booking }, { status: 201 });
}
