'use client';

import FogBackground from './fog/FogBackground';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.container}>
      <FogBackground
        density={0.9}
        speed={1.0}
        warp={1.2}
        tint="#9AE7FF"
        pointerStrength={0.4}
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
