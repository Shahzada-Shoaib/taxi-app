import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = ts.transpileModule(fs.readFileSync("app/api/contact/route.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function handler(send, env = { RESEND_API_KEY: "test-key", NEWSLETTER_EMAIL: "owner@example.com" }) {
  const exports = {};
  class Resend {
    constructor(key) {
      assert.equal(key, env.RESEND_API_KEY);
      this.emails = { send };
    }
  }
  new Function("require", "exports", "process", source)(() => ({ Resend }), exports, { env });
  return exports.POST;
}
const enquiry = { kind: "enquiry", name: "Test Customer", email: "customer@example.com", phone: "+447735090685", message: "Airport transfer enquiry" };
const request = data => new Request("https://bcm.example/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://bcm.example" }, body: JSON.stringify(data),
});

test("sends to the fixed recipient, preserving customer details and overriding provider controls", async () => {
  const post = handler(async body => {
    assert.deepEqual(body.to, ["owner@example.com"]);
    assert.equal(body.from, "BCM Enquiries <onboarding@resend.dev>");
    assert.equal(body.replyTo, enquiry.email);
    for (const value of [enquiry.name, enquiry.email, enquiry.phone, enquiry.message]) assert(body.text.includes(value));
    assert.equal(body.subject, "BCM — New website enquiry");
    assert.equal(body.cc, undefined);
    return { data: { id: "email-123" }, error: null };
  });
  assert.deepEqual(await (await post(request({ ...enquiry, _subject: "Injected", _cc: "other@example.com" }))).json(), { success: true });
});

test("provider rejection, missing confirmation and network errors never report success", async () => {
  for (const reply of [
    () => ({ data: null, error: { message: "Forbidden" } }),
    () => ({ data: null, error: null }),
    () => ({ data: {}, error: null }),
    () => { throw new DOMException("Timed out", "TimeoutError"); },
  ]) {
    const response = await handler(reply)(request(enquiry));
    assert(response.status >= 500);
    assert.equal((await response.json()).success, false);
  }
});

test("invalid input and honeypot submissions never contact the provider", async () => {
  const post = handler(() => assert.fail("Must not send"));
  for (const data of [null, [], { ...enquiry, name: " " }, { ...enquiry, email: "invalid" }, { ...enquiry, message: " " }, { ...enquiry, _honey: "bot" }, { ...enquiry, kind: "unknown" }]) {
    assert.equal((await post(request(data))).status, 400);
  }
});

test("booking includes itinerary; impossible dates and invalid passenger counts are rejected", async () => {
  const booking = { ...enquiry, kind: "booking", pickup: "London", destination: "Heathrow", pickup_date: "2099-12-01", pickup_time: "10:30", passengers: "4", service: "Airport transfers", vehicle: "Mercedes V-Class" };
  const post = handler(async data => {
    for (const value of [booking.vehicle, booking.pickup, booking.destination, booking.pickup_date, booking.pickup_time, booking.passengers, booking.service]) assert(data.text.includes(value));
    assert.equal(data.subject, "BCM — New booking request");
    return { data: { id: "email-123" }, error: null };
  });
  assert.equal((await post(request(booking))).status, 200);
  const invalid = handler(() => assert.fail("Must not send"));
  for (const change of [{ pickup_date: "2099-02-31" }, { pickup_date: "2000-01-01" }, { pickup_time: "25:00" }, { passengers: "0" }, { pickup: "" }]) {
    assert.equal((await invalid(request({ ...booking, ...change }))).status, 400);
  }
});

test("cross-origin requests are rejected", async () => {
  const input = request(enquiry);
  input.headers.set("origin", "https://other.example");
  assert.equal((await handler(() => assert.fail("Must not send"))(input)).status, 403);
});

test("missing or invalid server configuration never sends", async () => {
  for (const env of [{}, { RESEND_API_KEY: "test-key" }, { RESEND_API_KEY: "test-key", NEWSLETTER_EMAIL: "invalid" }]) {
    assert.equal((await handler(() => assert.fail("Must not send"), env)(request(enquiry))).status, 503);
  }
});

test("supports a configured verified sender", async () => {
  const env = { RESEND_API_KEY: "test-key", NEWSLETTER_EMAIL: "owner@example.com", RESEND_FROM_EMAIL: "BCM <enquiries@example.com>" };
  const post = handler(async data => {
    assert.equal(data.from, env.RESEND_FROM_EMAIL);
    return { data: { id: "email-123" }, error: null };
  }, env);
  assert.equal((await post(request(enquiry))).status, 200);
});
