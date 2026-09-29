import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const source = ts.transpileModule(fs.readFileSync("app/api/contact/route.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function handler(fetch) {
  const exports = {};
  new Function("require", "exports", "fetch", source)(() => ({ contact: { email: "owner@example.com" } }), exports, fetch);
  return exports.POST;
}
const enquiry = { kind: "enquiry", name: "Test Customer", email: "customer@example.com", phone: "+447735090685", message: "Airport transfer enquiry" };
const request = data => new Request("https://bcm.example/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://bcm.example" }, body: JSON.stringify(data),
});

test("sends to the fixed recipient, preserving customer details and overriding provider controls", async () => {
  const post = handler(async (url, options) => {
    assert.equal(url, "https://formsubmit.co/ajax/owner@example.com");
    const body = JSON.parse(options.body);
    assert.equal(body.email, enquiry.email);
    assert.equal(body.message, enquiry.message);
    assert.equal(body._subject, "BCM — New website enquiry");
    assert.equal(body._url, "https://bcm.example/");
    assert.equal(body._cc, undefined);
    return Response.json({ success: "true" });
  });
  assert.deepEqual(await (await post(request({ ...enquiry, _subject: "Injected", _cc: "other@example.com" }))).json(), { success: true });
});

test("provider rejection, HTML error, timeout and activation never report success", async () => {
  for (const reply of [
    () => Response.json({ success: false }),
    () => Response.json({ success: "false" }),
    () => new Response("Service unavailable", { status: 503 }),
    () => Response.json({ success: true, message: "Please activate your form" }),
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
  const post = handler(async (_, options) => {
    const data = JSON.parse(options.body);
    assert.equal(data.vehicle, booking.vehicle);
    assert.equal(data._subject, "BCM — New booking request");
    return Response.json({ success: true });
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
