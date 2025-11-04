import React, { useMemo } from "react";
import GlyphTile from "@/components/GlyphTile";      // default export
import type { Glyph } from "@/types/glyph";          // type-only import
import glyphsData from "@/data/glyphs.json";         // JSON import

type Props = {
  query?: string;                   // optional text filter
  category?: string | "All";        // optional category filter
  onCopy?: (g: Glyph) => void;
  onShowDetails?: (g: Glyph) => void;
  onToggleFavorite?: (g: Glyph) => void;
  className?: string;
};

export default function GlyphGrid({
  query = "",
  category = "All",
  onCopy,
  onShowDetails,
  onToggleFavorite,
  className,
}: Props) {
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = (glyphsData as Glyph[]).filter(g =>
      category === "All" ? true : g.category === category
    );
    if (!q) return base;
    return base.filter(g => {
      const hay = `${g.symbol} ${g.name.toLowerCase()} ${g.unicode.toLowerCase()} ${g.html.toLowerCase()}`;
      return hay.includes(q);
    });
  }, [query, category]);

  return (
    <div role="grid" className={className}>
      {items.map(g => (
        <GlyphTile
          key={g.unicode}
          glyph={g}
          onCopy={onCopy ?? (() => {})}
          onShowDetails={onShowDetails ?? (() => {})}
          onToggleFavorite={onToggleFavorite ?? (() => {})}
        />
      ))}
    </div>
  );
}