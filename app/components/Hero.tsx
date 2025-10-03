'use client';

import FogBackground from './fog/FogBackground';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.container}>
      <FogBackground
        density={1.35}
        speed={1.15}
        warp={1.60}
        tint="#9BE9FF"
        pointerStrength={0.55}
        pointerRadius={0.42}
        background="#0A0B14"
      />
      
      <div className={styles.content}>
        <nav className={styles.nav}>
          <div className={styles.logo}>OCTAVE-X</div>
          
          <ul className={styles.navMenu}>
            <li className={`${styles.navItem} ${styles.navItemActive}`}>Home</li>
            <li className={styles.navItem}>About</li>
            <li className={styles.navItem}>Metrics</li>
            <li className={styles.navItem}>Architecture</li>
            <li className={styles.navItem}>Careers</li>
          </ul>
          
          <button className={styles.cta}>Get Started</button>
        </nav>

        <main className={styles.hero}>
          <div className={styles.heroBackdrop} />
          
          <h1 className={styles.headline}>TENZIN</h1>
          
          <p className={styles.tagline}>
            Safe-Human Level Intelligence
          </p>
        </main>
      </div>
    </div>
  );
}
