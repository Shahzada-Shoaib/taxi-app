"use client";

import { useState } from "react";
// import { fleet } from "./fleet";
import { bookingWhatsappNumber } from "./site-config";

type Props = {
  services: { title: string }[];
  selectedService: number;
  onServiceChange: (index: number) => void;
  selectedVehicle: string;
  onVehicleChange: (vehicle: string) => void;
};

function todayInUK() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
};

export const fleet = [
  { name: "Mercedes Vito" },
  { name: "Mercedes V-Class" },
  { name: "VW Transporter" },
  { name: "Mercedes E-Class" },
  { name: "Toyota Prius" },
  { name: "Others" },

];

export default function BookingForm({ services, selectedService, onServiceChange, selectedVehicle, onVehicleChange }: Props) {
  const [timing, setTiming] = useState("now");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const message = [
    "Hello BCM, I'd like to request a booking.",
    "",
    `Service: ${services[selectedService].title}`,
    `Pick-up: ${pickup.trim()}`,
    `Destination: ${destination.trim()}`,
    `When: ${timing === "now" ? "As soon as possible" : date.replace("T", " at ") + " (UK local time)"}`,
    `Vehicle: ${selectedVehicle || "No preference — please advise"}`,
    `Passengers: ${passengers}`,
    "",
    "Please confirm availability and the fare. Thank you.",
  ].join("\n");

  return (
    <div className="booking-wrap wrap" id="book">
      <div className="booking-toolbar">
        <span>Let’s plan your journey</span>
        <label>Service<select value={selectedService} onChange={event => onServiceChange(Number(event.target.value))}>{services.map((service, index) => <option key={service.title} value={index}>{service.title}</option>)}</select></label>
      </div>
      <form className="compact-booking" action={`https://wa.me/${bookingWhatsappNumber}`} method="GET" target="_blank" rel="noopener noreferrer" onSubmit={event => {
        if (timing === "later") {
          const input = event.currentTarget.querySelector<HTMLInputElement>('input[type="datetime-local"]');
          if (input) input.min = `${todayInUK()}T00:00`;
        }
        if (!event.currentTarget.reportValidity()) event.preventDefault();
      }}>
        <input type="hidden" name="text" value={message} />
        <div className="booking-card">
          <div className="ride-toggle" role="group" aria-label="Ride timing">
            <button type="button" className={timing === "now" ? "active" : ""} aria-pressed={timing === "now"} onClick={() => setTiming("now")}>Ride now</button>
            <button type="button" className={timing === "later" ? "active" : ""} aria-pressed={timing === "later"} onClick={() => setTiming("later")}>Schedule</button>
          </div>
          <label className="field"><span className="location-dot" aria-hidden="true" /><span><small>Pick-up location</small><input required pattern=".*\S.*" maxLength={250} value={pickup} onChange={event => setPickup(event.target.value)} placeholder="pickup Address" /></span></label>
          <button type="button" className="swap-locations" aria-label="Swap pick-up and destination" onClick={() => { setPickup(destination); setDestination(pickup); }}>⇄</button>
          <label className="field"><span className="location-dot destination-dot" aria-hidden="true" /><span><small>Destination</small><input required pattern=".*\S.*" maxLength={250} value={destination} onChange={event => setDestination(event.target.value)} placeholder="Address, airport or station" /></span></label>
          <button className="search-button" type="submit">Send booking request <span aria-hidden="true">↗</span></button>
          {timing === "later" && <label className="field schedule-field"><span><small>Pick-up date & time (UK local time)</small><input type="datetime-local" required value={date} onChange={event => setDate(event.target.value)} onFocus={event => { event.currentTarget.min = `${todayInUK()}T00:00`; }} /></span></label>}
        </div>
        <div className="compact-booking-options">
          <label>Vehicle<select value={selectedVehicle} onChange={event => onVehicleChange(event.target.value)}><option value="">No preference</option>{fleet.map(vehicle => <option key={vehicle.name}>{vehicle.name}</option>)}</select></label>
          <label>Passengers<select value={passengers} onChange={event => setPassengers(event.target.value)}>{Array.from({ length: 16 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}<option value="17+">17+</option></select></label>
          <p>Opens WhatsApp with your details. Tap Send in the chat to request your ride.</p>
        </div>
      </form>

      
    </div>
  );
}
