// src/pages/StartPage.tsx
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import GlyphGrid from "@/components/GlyphGrid";

export default function StartPage() {
  return (
    <>
      <header>
        <Logo />
      </header>

      <main>
        <GlyphGrid />
      </main>

      <Footer />
    </>
  );
}