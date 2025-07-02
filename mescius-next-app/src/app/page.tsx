// src/app/page.tsx
import Hero from '@/components/Hero';
import LogoStrip from '@/components/LogoStrip';
import FeaturedSolutions from '@/components/FeaturedSolutions'; // Import our new component

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <FeaturedSolutions /> {/* Place the new section here */}
    </>
  );
}