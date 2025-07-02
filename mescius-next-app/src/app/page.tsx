import Greeting from '@/components/Greeting'; // Import the component

export default function Home() {
  return (
    <main>
      <h1>My First Next.js Page!</h1>
      <Greeting /> {/* Use the component */}
    </main>
  );
}