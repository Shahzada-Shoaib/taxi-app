"use client";

import { FormEvent, useRef, useState } from "react";

type Service = { title: string; exampleFare: number; unit: string };
type Props = { services: Service[]; selectedService: number; onServiceChange: (index: number) => void };
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const vehicles = [
  { title: "Saloon", detail: "4 passengers · 2 bags", supplement: 0 },
  { title: "Estate", detail: "4 passengers · 3 bags", supplement: 6 },
  { title: "Executive", detail: "4 passengers · premium comfort", supplement: 15 },
];

export default function BookingForm({ services, selectedService, onServiceChange }: Props) {
  const [rideType, setRideType] = useState("now");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState(0);
  const [journey, setJourney] = useState<{ pickup: string; destination: string; date: string; service: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pickup.trim() || !destination.trim()) return;
    setJourney({ pickup: pickup.trim(), destination: destination.trim(), date: rideType === "later" ? date : "", service: selectedService });
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  }

  return (
    <div className="booking-wrap wrap" id="book">
      <div className="booking-toolbar">
        <span>Let’s plan your journey</span>
        <label>Service
          <select value={selectedService} onChange={event => { onServiceChange(Number(event.target.value)); setJourney(null); }}>
            {services.map((service, index) => <option key={service.title} value={index}>{service.title}</option>)}
          </select>
        </label>
      </div>
      <form className="booking-card" onSubmit={submit} onChange={() => setJourney(null)}>
        <div className="ride-toggle" role="group" aria-label="Ride timing">
          <button type="button" aria-pressed={rideType === "now"} className={rideType === "now" ? "active" : ""} onClick={() => { setRideType("now"); setJourney(null); }}>Ride now</button>
          <button type="button" aria-pressed={rideType === "later"} className={rideType === "later" ? "active" : ""} onClick={() => { setRideType("later"); setJourney(null); }}>Schedule</button>
        </div>
        <label className="field"><span className="location-dot" aria-hidden="true" /><span><small>Pick-up location</small><input id="pickup" required pattern=".*\S.*" value={pickup} onChange={event => setPickup(event.target.value)} aria-label="Pick-up address or UK postcode" placeholder="Address or UK postcode" /></span></label>
        <button type="button" className="swap-locations" aria-label="Swap pick-up and destination" onClick={() => { setPickup(destination); setDestination(pickup); setJourney(null); }}>⇄</button>
        <label className="field"><span className="location-dot destination-dot" aria-hidden="true" /><span><small>Destination</small><input required pattern=".*\S.*" value={destination} onChange={event => setDestination(event.target.value)} aria-label="Destination address, airport or station" placeholder="Address, airport or station" /></span></label>
        <button className="search-button" type="submit">Preview my ride <span aria-hidden="true">↗</span></button>
        {rideType === "later" && <label className="field schedule-field"><span><small>Pick-up time (UK local time)</small><input required value={date} onChange={event => setDate(event.target.value)} aria-label="Pick-up time in UK local time" type="datetime-local" /></span></label>}
      </form>
      {journey && journey.service === selectedService && <div ref={resultRef} className="journey-preview" tabIndex={-1} aria-label="Your journey preview">
        <div className="preview-heading"><div><small>YOUR JOURNEY PREVIEW</small><h3>{services[journey.service].title}</h3></div><button type="button" className="preview-close" aria-label="Close journey preview" onClick={() => { setJourney(null); document.getElementById("pickup")?.focus(); }}>×</button></div>
        <p className="preview-route"><span>{journey.pickup}</span><span aria-hidden="true">→</span><span>{journey.destination}</span></p>
        <p className="preview-time">{journey.date ? `${journey.date.split("T")[0].split("-").reverse().join("/")} at ${journey.date.split("T")[1]} · UK local time` : "Ride now"}</p>
        <div className="vehicle-options" role="group" aria-label="Choose a vehicle for your preview">
          {vehicles.map((option, index) => <button type="button" key={option.title} aria-pressed={index === vehicle} onClick={() => setVehicle(index)}><strong>{option.title}</strong><small>{option.detail}</small><span>{index === vehicle ? "Selected ✓" : "Select vehicle"}</span></button>)}
        </div>
        <div className="preview-price" aria-live="polite"><span>Example fare <small>{services[journey.service].unit}</small></span><strong>{pounds.format(services[journey.service].exampleFare + vehicles[vehicle].supplement)}</strong></div>
        <p className="preview-disclaimer">Illustrative pricing only, not calculated from your route. This is a preview; no journey has been booked.</p>
      </div>}
    </div>
  );
}
