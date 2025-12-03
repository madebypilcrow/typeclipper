// src/components/GlyphGrid.tsx
import { useMemo } from "react";
import GlyphTile from "@/components/GlyphTile";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import { copyToClipboard } from "@/utils/copyToClipboard";
import "@/styles/glyphGrid.scss";

type Props = {
  query?: string;
  category?: string | "All";
  className?: string;
};

export default function GlyphGrid({
  query = "",
  category = "All",
  className = "",
}: Props) {
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = (glyphsData as Glyph[]).filter((g) =>
      category === "All" ? true : g.category === category
    );
    if (!q) return base;
    return base.filter((g) => {
      const hay = `${g.symbol} ${g.name} ${g.html} ${g.unicode}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const handleCopy = async (glyph: Glyph) => {
    try {
      await copyToClipboard(glyph.symbol);
      console.log("copied", glyph.symbol);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleShowDetails = (glyph: Glyph) => {
    console.log("details", glyph);
    // TODO: open modal/bottom sheet
  };

  const handleToggleFavorite = (glyph: Glyph) => {
    console.log("favorite", glyph);
    // TODO: update favorites state
  };

  return (
    <div
      className={`glyph-grid ${className ?? ""}`}
      role="list"
    >
      {items.map((glyph) => (
        <GlyphTile
          key={glyph.unicode}
          glyph={glyph}
          onCopy={handleCopy}
          onShowDetails={handleShowDetails}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}