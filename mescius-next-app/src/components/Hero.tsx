// src/components/Hero.tsx
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.headline}>Build Better Applications, Faster</h1>
        <p className={styles.subheadline}>
          Explore common development challenges and discover how our components provide the foundation for powerful, data-driven applications.
        </p>
        <Link href="/solutions" className="btn btnPrimary">
          Explore Solutions
        </Link>
      </div>
    </section>
  );
}