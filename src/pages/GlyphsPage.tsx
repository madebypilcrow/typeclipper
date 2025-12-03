// src/pages/GlyphsPage.tsx
import GlyphGrid from "@/components/GlyphGrid";

export default function GlyphsPage() {
  const category: string | "All" = "All"; // placeholder; later this may come from state or URL
  const title = category === "All" ? "All Characters" : category;

  return (
    <section
      className="section glyph-screen"
      aria-labelledby="glyphs-title"
    >
      <div className="section-wrapper glyph-screen__wrapper">
        <div className="glyph-screen__header">
          <h1 id="glyphs-title" className="screen-title">
            {title}
          </h1>

          {/* future controls (search, filters) */}
          {/* e.g. <GlyphSearchBar /> / filter pills, etc. */}
        </div>

        <GlyphGrid category={category} />
      </div>
    </section>
  );
}