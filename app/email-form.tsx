"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { contact, whatsappHref } from "./site-config";

export default function EmailForm({ children, className, kind, onValidate }: {
  children: ReactNode;
  className: string;
  kind: "booking" | "enquiry";
  onValidate?: (form: HTMLFormElement) => boolean;
}) {
  const busy = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy.current || (onValidate && !onValidate(form)) || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    busy.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error("Submission not confirmed");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  return <form className={className} action="/api/contact" method="POST" onSubmit={submit} aria-busy={status === "sending"}>
    <fieldset className="email-form-fields" disabled={status === "sending" || status === "success"}>{children}</fieldset>
    <div aria-live="polite" role="status">
      {status === "sending" && <p className="submission-message">Sending your request…</p>}
      {status === "success" && <div className="submission-message submission-success"><p>Thank you. Your request has been submitted. Our team will get back to you.{kind === "booking" && " Your ride is not confirmed until we contact you."}</p><button type="button" onClick={() => setStatus("idle")}>Edit or send another request</button></div>}
      {status === "error" && <p className="submission-message submission-error">We couldn’t confirm your submission. Your details are still here. Please try again, <a href={`mailto:${contact.email}`}>email us directly</a>{whatsappHref && <> or <a href={whatsappHref} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a></>}.</p>}
    </div>
  </form>;
}
