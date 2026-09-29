"use client";

import Image from "next/image";
import { useState } from "react";
import RoadBanner from "./road-banner";
import BookingForm from "./booking-form";
import { usePageMotion } from "./use-page-motion";
import ContactSection from "./contact-section";
import { contact, phoneHref, whatsappHref } from "./site-config";
import { fleet } from "./fleet";

type IconName =
  | "arrow"
  | "calendar"
  | "car"
  | "check"
  | "clock"
  | "facebook"
  | "instagram"
  | "location"
  | "mail"
  | "menu"
  | "phone"
  | "plane"
  | "route"
  | "shield"
  | "star"
  | "wallet"
  | "whatsapp"
  | "x";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    car: <><path d="m5 17-2-1v-4l2-1 2-5h10l2 5 2 1v4l-2 1" /><path d="M5 17v2h3v-2M16 17v2h3v-2M6.5 11h11M7 14h.01M17 14h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    phone: <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7 9.6a16 16 0 0 0 7.4 7.4l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
    plane: <><path d="M22 2 9 15" /><path d="m22 2-7 20-4-9-9-4Z" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h3a3 3 0 0 0 3-3v-5a3 3 0 0 1 3-3h1" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.2L5.8 21 7 14.1 2 9.3l6.9-1Z" />,
    wallet: <><path d="M4 5h14a2 2 0 0 1 2 2v12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12" /><path d="M16 11h6v5h-6a2.5 2.5 0 0 1 0-5Z" /></>,
    whatsapp: <><path d="M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z" /><path d="M8 7c0 4 3 7 7 7l1-2-2-1-1 1-3-3 1-1-1-2Z" /></>,
    x: <><path d="M6 6l12 12M18 6 6 18" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

// Illustrative design prices, pending the operator's confirmed UK tariff.
const services = [
  { icon: "car" as const, number: "01", title: "Local journeys", text: "From your daily commute to the railway station, travel in comfort with a professional driver.", exampleFare: 18, unit: "/ journey" },
  { icon: "plane" as const, number: "02", title: "Airport transfers", text: "Start or finish your holiday with a comfortable transfer between your door and the terminal.", exampleFare: 65, unit: "/ transfer" },
  { icon: "clock" as const, number: "03", title: "Chauffeur hire", text: "An executive saloon and chauffeur for business meetings, special occasions or a day in town.", exampleFare: 45, unit: "/ hour" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [motionPaused, setMotionPaused] = useState(false);
  const rootRef = usePageMotion(motionPaused);

  return (
    <main ref={rootRef} className="site-shell" data-motion-paused={motionPaused}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="top-contact-bar">
        <div className="wrap top-contact-inner">
          {phoneHref ? <a className="top-phone" href={phoneHref}><Icon name="phone" size={15} /><span>Call us <strong>{contact.mobile}</strong></span></a> : <a className="top-phone" href="#contact"><Icon name="mail" size={15} /> Contact our team</a>}
          <div className="top-contact-links">
            {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={16} /> WhatsApp</a>}
            {contact.facebook && <a href={contact.facebook} target="_blank" rel="noopener noreferrer"><Icon name="facebook" size={15} /> Facebook</a>}
            <a href="#contact">Enquire now <Icon name="arrow" size={14} /></a>
          </div>
        </div>
      </div>
      <section className="hero" id="home">
        <nav className="nav wrap" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="BCM home">
            <Image src="/logo.png" alt="BCM" width={132} height={72} priority />
          </a>

          <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-controls="main-navigation-links" aria-expanded={menuOpen} aria-label="Toggle menu">
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>

          <div id="main-navigation-links" className={`nav-links ${menuOpen ? "is-open" : ""}`} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); rootRef.current?.querySelector<HTMLButtonElement>(".menu-button")?.focus(); } }}>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#fleet" onClick={() => setMenuOpen(false)}>Our fleet</a>
            <a href="#why-bcm" onClick={() => setMenuOpen(false)}>Why BCM</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>

          <a className="nav-cta" href="#book">Book a ride <Icon name="arrow" size={17} /></a>
        </nav>

        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-grid wrap">
          <div className="hero-copy" data-reveal>
            <div className="eyebrow"><span /> UK journeys. Personal service.</div>
            <h1><span>Every ride</span>{" "}<span>should feel</span>{" "}<em>first class.</em></h1>
            <p>Your everyday journey, reimagined. From local trips to airport transfers, enjoy premium taxi travel in the UK with BCM.</p>
            <div className="hero-actions">
              <a href="#book" className="button button-gold">Book your ride <Icon name="arrow" size={18} /></a>
              <a href="#fleet" className="text-link"><span className="play"><Icon name="car" size={17} /></span> Explore our fleet</a>
            </div>
            <div className="hero-proof">
              <div className="avatars" aria-hidden="true"><span>AK</span><span>SA</span><span>MK</span></div>
              <div><strong>4.9 <span>★★★★★</span></strong><small>Trusted by 12,000+ riders</small></div>
            </div>
          </div>

          <div className="hero-visual" data-motion-scene aria-label="BCM premium car service illustration">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="visual-badge visual-badge-top"><span><Icon name="shield" size={17} /></span><div><strong>Verified drivers</strong><small>Safe on every trip</small></div></div>
            <div className="visual-badge visual-badge-bottom"><span><Icon name="clock" size={17} /></span><div><strong>3 min away</strong><small>Your ride is nearby</small></div></div>
            <div className="car-stage">
              <div className="stage-shine" />
              <Image src="/logo.png" alt="BCM luxury car" width={677} height={369} priority />
              <div className="road-line road-line-one" />
              <div className="road-line road-line-two" />
            </div>
          </div>
        </div>

        <BookingForm services={services} selectedService={selectedService} onServiceChange={setSelectedService} selectedVehicle={selectedVehicle} onVehicleChange={setSelectedVehicle} />
      </section>

      <section className="trust-strip" aria-label="BCM achievements">
        <div className="wrap stats-grid" data-reveal>
          <div><strong>12K+</strong><span>Happy riders</span></div>
          <div><strong>350+</strong><span>Verified drivers</span></div>
          <div><strong>99.2%</strong><span>On-time pick-ups</span></div>
          <div><strong>24/7</strong><span>Customer care</span></div>
        </div>
      </section>

      <RoadBanner />

      <section className="section fleet-section" id="fleet">
        <div className="wrap">
          <div className="section-heading split-heading" data-reveal>
            <div><div className="eyebrow dark"><span /> Our fleet</div><h2>A little more space.<br /><em>A lot more comfort.</em></h2></div>
            <p>Executive cars and spacious minibuses for solo journeys, family travel and getting everyone there together.</p>
          </div>
          <div className="fleet-grid">
            {fleet.map(vehicle => <article className="fleet-card" key={vehicle.name}>
              <div className="fleet-image"><Image src={vehicle.image} alt={`${vehicle.name} exterior`} width={960} height={600} sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 580px" /></div>
              <div className="fleet-card-copy"><small>{vehicle.category}</small><h3>{vehicle.name}</h3><p>{vehicle.description}</p><a href="#book" onClick={() => setSelectedVehicle(vehicle.name)}>Request this vehicle <Icon name="arrow" size={17} /></a></div>
            </article>)}
          </div>
          <p className="fleet-note">Model images shown for illustration. Please confirm vehicle availability, seating and luggage space with our team.</p>
          <details className="photo-credits"><summary>Photo credits</summary><p>Images resized and cropped for display. Photos licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.</p>{fleet.map(vehicle => <a key={vehicle.name} href={`https://commons.wikimedia.org/wiki/File:${vehicle.file}`} target="_blank" rel="noopener noreferrer">{vehicle.name} — {vehicle.author} / Wikimedia Commons</a>)}</details>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="wrap">
          <div className="section-heading split-heading" data-reveal>
            <div><div className="eyebrow dark"><span /> Our services</div><h2>More than a ride.<br />It’s your time, <em>respected.</em></h2></div>
            <p>From a quick trip across town to a seamless airport transfer, every BCM service is built around your comfort.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title} data-reveal data-delay={index * 100}>
                <div className="service-top"><span className="service-icon"><Icon name={service.icon} size={24} /></span><small>{service.number}</small></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="service-fare">
                  <small>Example fare</small>
                  <div><strong>{pounds.format(service.exampleFare)}</strong><span>{service.unit}</span></div>
                </div>
                <a href="#book" onClick={() => setSelectedService(index)} aria-label={`Book ${service.title}`}>Book this service <Icon name="arrow" size={17} /></a>
              </article>
            ))}
          </div>
          <p className="fare-note">All prices are in GBP (£). These are illustrative fares, not live quotes. Your final fare will depend on the route, vehicle, waiting time and any airport charges.</p>
        </div>
      </section>

      <section className="section experience" id="why-bcm">
        <div className="wrap experience-grid">
          <div className="experience-art" data-reveal data-motion-scene>
            <div className="map-grid" />
            <div className="route-line"><span className="route-dot start" /><span className="route-dot end" /></div>
            <div className="phone-card">
              <div className="phone-top"><small>Your driver is arriving</small><strong>2 min</strong></div>
              <div className="mini-map"><span className="street street-one" /><span className="street street-two" /><span className="street street-three" /><span className="mini-car"><Icon name="car" size={18} /></span></div>
              <div className="driver-row"><span className="driver-avatar">AR</span><span><strong>Ahmed R.</strong><small>Executive saloon · 4 passengers</small></span><span className="rating"><Icon name="star" size={13} /> 4.9</span></div>
            </div>
            <div className="art-chip chip-price"><small>Example fare · GBP</small><strong>{pounds.format(24.5)}</strong></div>
            <div className="art-chip chip-safe"><Icon name="shield" size={18} /><span><strong>Ride protected</strong><small>Live trip monitoring</small></span></div>
          </div>
          <div className="experience-copy" data-reveal data-delay="120">
            <div className="eyebrow dark"><span /> Why choose BCM</div>
            <h2>Quiet luxury.<br /><em>Thoughtful details.</em></h2>
            <p>We take care of the little things that turn an ordinary taxi ride into a service you look forward to.</p>
            <div className="feature-list">
              <div><span><Icon name="shield" size={21} /></span><div><strong>Your safety comes first</strong><p>Background-checked drivers, live tracking and round-the-clock support.</p></div></div>
              <div><span><Icon name="wallet" size={21} /></span><div><strong>Clear pricing in pounds</strong><p>Check your fare in GBP (£), including any applicable charges, before confirming your journey.</p></div></div>
              <div><span><Icon name="star" size={21} /></span><div><strong>A consistently premium ride</strong><p>Immaculate vehicles and drivers trained to our service standard.</p></div></div>
            </div>
            <a className="button button-dark" href="#book">Experience BCM <Icon name="arrow" size={18} /></a>
          </div>
        </div>
      </section>

      <section className="section steps" id="how-it-works">
        <div className="wrap">
          <div className="section-heading centered" data-reveal>
            <div className="eyebrow dark"><span /> Simple by design</div>
            <h2>Wherever you’re going,<br /><em>we make it effortless.</em></h2>
          </div>
          <div className="steps-grid" data-reveal>
            <article><span className="step-number">01</span><div className="step-icon"><Icon name="location" size={25} /></div><h3>Tell us where</h3><p>Enter your UK postcode or address and choose your destination.</p></article>
            <article><span className="step-number">02</span><div className="step-icon"><Icon name="car" size={25} /></div><h3>Choose your ride</h3><p>Select the car that suits your moment and your style.</p></article>
            <article><span className="step-number">03</span><div className="step-icon"><Icon name="route" size={25} /></div><h3>We’ll confirm the details</h3><p>Our team will confirm availability, your fare and your booking before you travel.</p></article>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="wrap quote-grid" data-reveal>
          <div className="quote-copy"><div className="quote-mark">“</div><blockquote>BCM is the only ride service that feels reliable enough for my client meetings—and comfortable enough for my family.</blockquote><div className="quote-author"><span>HZ</span><div><strong>Hamza Zafar</strong><small>BCM rider since 2024</small></div></div></div>
          <div className="quote-panel"><div className="quote-panel-inner"><span className="tiny-label">The BCM standard</span><strong>Arrive calm.<br />Arrive on time.<br /><em>Arrive in style.</em></strong><a href="#book">Take your first ride <Icon name="arrow" size={17} /></a></div></div>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap cta-inner" data-reveal>
          <div><div className="eyebrow"><span /> Your ride is ready</div><h2>Move better with BCM.</h2><p>Premium cars. Professional drivers. One beautifully simple ride.</p></div>
          <a className="button button-gold" href="#book">Book a ride now <Icon name="arrow" size={18} /></a>
        </div>
      </section>

      <ContactSection />

      <footer>
        <div className="wrap footer-controls">
          <button type="button" className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? "Resume animations" : "Pause animations"}</button>
          <a href="#home">Back to top ↑</a>
        </div>
        <div className="wrap footer-grid">
          <div className="footer-brand"><Image src="/logo.png" alt="BCM" width={140} height={76} /><p>Premium UK journeys, thoughtfully delivered.</p><div className="socials">{contact.facebook && <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="BCM on Facebook"><Icon name="facebook" size={17} /></a>}{whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="BCM on WhatsApp"><Icon name="whatsapp" size={17} /></a>}</div></div>
          <div className="footer-column"><strong>Company</strong><a href="#why-bcm">About BCM</a><a href="#services">Services</a><a href="#why-bcm">Safety</a><a href="#">Drive with us</a></div>
          <div className="footer-column"><strong>Support</strong><a href="#">Help centre</a><a href="#">Terms of service</a><a href="#">Privacy policy</a></div>
          <div className="footer-column contact-column"><strong>Get in touch</strong>{phoneHref && <a href={phoneHref}><Icon name="phone" size={16} /> {contact.mobile}</a>}<a href={`mailto:${contact.email}`}><Icon name="mail" size={16} /> {contact.email}</a><a href="#contact">Send an enquiry <Icon name="arrow" size={16} /></a></div>
        </div>
        <div className="wrap footer-bottom"><span>© 2026 BCM. All rights reserved.</span><span>United Kingdom · English (UK) · GBP (£)</span></div>
      </footer>
    </main>
  );
}
