import { useEffect, useMemo, useState } from "react";
import type { Glyph } from "@/types/glyph";

import GlyphGrid from "@/components/GlyphGrid";
import GlyphDetailsModal from "@/components/GlyphDetailsModal";
import SearchControls from "@/components/SearchControls";
import { readFavoriteUnicodes, toggleFavorite } from "@/utils/favorites";

export default function GlyphsPage() {
  const category: string | "All" = "All";
  const title = category === "All" ? "All Characters" : category;

  const [detailsGlyph, setDetailsGlyph] = useState<Glyph | null>(null);

  const [favUnicodes, setFavUnicodes] = useState<string[]>(() =>
    readFavoriteUnicodes()
  );

  // Keep in sync with favorites toggled elsewhere (Favorites page, other tabs)
  useEffect(() => {
    const onChange = () => setFavUnicodes(readFavoriteUnicodes());
    window.addEventListener(
      "typeclipper:favorites-changed",
      onChange as EventListener
    );
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(
        "typeclipper:favorites-changed",
        onChange as EventListener
      );
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const favSet = useMemo(() => new Set(favUnicodes), [favUnicodes]);

  const handleShowDetails = (g: Glyph) => setDetailsGlyph(g);
  const handleCloseDetails = () => setDetailsGlyph(null);

  const handleToggleFavorite = (g: Glyph) => {
    const next = toggleFavorite(g); // persists + dispatches event
    setFavUnicodes(next); // keep modal state in sync immediately
  };

  return (
    <>
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

          <GlyphGrid category={category} onShowDetails={handleShowDetails} />
        </div>
      </section>

      <GlyphDetailsModal
        isOpen={Boolean(detailsGlyph)}
        glyph={detailsGlyph}
        isFavorite={detailsGlyph ? favSet.has(detailsGlyph.unicode) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={handleCloseDetails}
      />
    </>
  );
}