import { contact, phoneHref, whatsappHref } from "./site-config";
import EmailForm from "./email-form";
import { CustomerFields, FormSettings } from "./form-fields";

export default function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="wrap contact-grid">
        <div className="section-heading contact-copy">
          <div className="eyebrow dark"><span /> Get in touch</div>
          <h2>A question?<br /><em>Let’s talk.</em></h2>
          <p>Planning an airport transfer, a group trip or something a little different? Tell us what you need and we’ll help with the details.</p>
          <div className="contact-methods">
            {phoneHref && <a href={phoneHref}><small>Call our team</small><strong>{contact.mobile}</strong></a>}
            <a href={`mailto:${contact.email}`}><small>Email us</small><strong>{contact.email}</strong></a>
            {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><small>Prefer a message?</small><strong>Chat on WhatsApp ↗</strong></a>}
            {contact.facebook && <a href={contact.facebook} target="_blank" rel="noopener noreferrer"><small>Stay connected</small><strong>Follow BCM on Facebook ↗</strong></a>}
          </div>
        </div>
        <EmailForm className="request-form enquiry-form" kind="enquiry">
          <h3>Send an enquiry</h3>
          <p className="form-intro">Leave your details and our team will get back to you.</p>
          <FormSettings subject="BCM — New website enquiry" />
          <div className="form-grid enquiry-fields">
            <CustomerFields />
            <label>Your message<textarea name="message" rows={4} required maxLength={3000} placeholder="How can we help?" /></label>
          </div>
          <p className="form-privacy">We’ll use your details to respond to your enquiry.</p>
          <button className="button button-gold" type="submit">Send enquiry <span aria-hidden="true">↗</span></button>
        </EmailForm>
      </div>
    </section>
  );
}
