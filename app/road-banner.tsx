import styles from "./road-banner.module.css";

export default function RoadBanner() {
  return (
    <section className={styles.banner} aria-labelledby="road-banner-title">
      <div className={styles.lanes} aria-hidden="true" />
      <div className={styles.crossing} aria-hidden="true" />
      <div className={styles.direction} aria-hidden="true">→</div>
      <div className={`wrap ${styles.content}`}>
        <span className={styles.taxiSign} aria-hidden="true">TAXI</span>
        <div className={styles.copy}>
          <p>BCM · ON THE MOVE</p>
          <h2 id="road-banner-title">Your city. <span>Your ride.</span></h2>
        </div>
      </div>
    </section>
  );
}
