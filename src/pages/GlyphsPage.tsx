import GlyphGrid from "@/components/GlyphGrid";
import SearchControls from "@/components/SearchControls";

export default function GlyphsPage() {
  const category: string | "All" = "All";
  const title = category === "All" ? "All Characters" : category;

  return (
    <section
      className="section screen glyph-screen"
      aria-labelledby="glyphs-title"
    >
      <div className="section-wrapper screen__wrapper">
        <div className="screen__header">
          <SearchControls />
          <h1 id="glyphs-title" className="screen__title">
            {title}
          </h1>
        </div>
        <GlyphGrid category={category} />
      </div>
    </section>
  );
}
