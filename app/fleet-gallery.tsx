"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import photos from "./fleet-photos.json";
import styles from "./fleet-gallery.module.css";

const descriptions = [
  "Black executive saloon outside a hotel",
  "Black Mercedes minibus at Birmingham Airport",
  "Black executive saloon outside a timber-framed building",
  "Black minibus viewed from the front",
  "Silver executive saloon at a country estate entrance",
  "Silver Mercedes saloon outside a country house",
  "Silver executive saloon outside a covered entrance",
  "Silver Mercedes minibus on a sunny day",
  "Black minibus at Heathrow Terminal 5",
];

export default function FleetGallery() {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = photos[active];

  function open(index: number) {
    setActive(index);
    dialog.current?.showModal();
  }

  function move(direction: number) {
    setActive(index => (index + direction + photos.length) % photos.length);
  }

  return <>
    <div className={styles.gallery} aria-label="Our fleet photo gallery">
      {photos.map((item, index) => <button key={item.src} type="button" className={styles.tile} onClick={() => open(index)} aria-label={`Enlarge photo ${index + 1}: ${descriptions[index]}`} aria-haspopup="dialog">
        <Image src={item.src} alt={descriptions[index]} width={item.width} height={item.height} sizes="(max-width: 600px) 50vw, (max-width: 980px) 33vw, 295px" />
        <span className={styles.expand} aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div className={styles.cta}>
      <a href="#book" className="button button-gold">Book your ride <span aria-hidden="true">↗</span></a>
    </div>
    <dialog ref={dialog} className={styles.viewer} aria-label="Fleet photos" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
      <div className={styles.viewerContent}>
        <div className={styles.toolbar}>
          <span aria-live="polite">{active + 1} / {photos.length}</span>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close photo viewer">✕</button>
        </div>
        <div className={styles.fullPhoto}>
          <Image src={photo.src} alt={descriptions[active]} fill sizes="(max-width: 1100px) 94vw, 1050px" />
        </div>
        <div className={styles.navigation}>
          <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
        </div>
      </div>
    </dialog>
  </>;
}
