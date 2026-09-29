import { contact } from "../../site-config";

export const runtime = "nodejs";

const failure = (status: number) => Response.json({ success: false }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return failure(403);
  if (!request.headers.get("content-type")?.includes("application/json")) return failure(415);

  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 16000) return failure(413);
    data = JSON.parse(body);
    if (!data || typeof data !== "object" || Array.isArray(data)) return failure(400);
  } catch {
    return failure(400);
  }

  if (data._honey) return failure(400);
  if (data.kind !== "booking" && data.kind !== "enquiry") return failure(400);
  const fields: Record<string, string> = {};
  const limits: Record<string, number> = {
    name: 100, email: 254, phone: 30, message: 3000,
    pickup: 250, destination: 250, service: 100, pickup_date: 10,
    pickup_time: 5, passengers: 2, vehicle: 100, notes: 2000,
  };
  for (const [key, limit] of Object.entries(limits)) {
    const value = data[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length > limit) return failure(400);
    fields[key] = value.trim();
  }
  if (!fields.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email || "") || !/^[+\d ()-]{7,30}$/.test(fields.phone || "")) return failure(400);
  if (data.kind === "enquiry" && !fields.message) return failure(400);
  if (data.kind === "booking") {
    if (!fields.pickup || !fields.destination || !fields.service || !/^\d{4}-\d{2}-\d{2}$/.test(fields.pickup_date || "") || !/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.pickup_time || "")) return failure(400);
    const date = new Date(`${fields.pickup_date}T12:00:00Z`);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== fields.pickup_date || fields.pickup_date < today) return failure(400);
    const passengers = Number(fields.passengers);
    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 50) return failure(400);
  }

  try {
    // Server-side fetch avoids the browser's failing HTTP/3 (QUIC) redirect.
    const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _subject: data.kind === "booking" ? "BCM — New booking request" : "BCM — New website enquiry",
        _template: "table",
        _captcha: "false",
        _url: new URL("/", request.url).href,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== "true")) return failure(502);
    if (/activat|confirm.*email/i.test(String(result.message || ""))) return failure(503);
    return Response.json({ success: true });
  } catch {
    return failure(502);
  }
}
