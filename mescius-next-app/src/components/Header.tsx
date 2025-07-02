// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css'; // This import is correct!

export default function Header() {
  return (
    // V-- APPLY THE STYLES HERE --V
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://cdn.mescius.io/umb/media/pujnxfci/mescuis-logo-horiz.svg"
            alt="Mescius Logo"
            width={150}
            height={36}
          />
        </Link>

        {/* V-- AND HERE --V */}
        <nav className={styles.navLinks}>
          <Link href="/solutions">Solutions</Link>
          <Link href="/products">Products</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/bundles">Bundles</Link>
        </nav>

        {/* V-- AND ESPECIALLY HERE --V */}
        <Link href="/contact-sales" className="btn btnPrimary">
          Contact Sales
        </Link>
      </div>
    </header>
  );
}