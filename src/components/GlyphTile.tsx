// src/components/GlyphTile.tsx
import type { Glyph } from "@/types/glyph";
import "@/styles/glyphTile.scss";

type Props = {
  glyph: Glyph;
  onCopy: (g: Glyph) => void;
  onShowDetails: (g: Glyph) => void;
  onToggleFavorite: (g: Glyph) => void;
  className?: string;
};

export default function GlyphTile({
  glyph,
  onCopy,
  onShowDetails,
  onToggleFavorite,
  className = "",
}: Props) {
  return (
    <div className={`glyph-tile ${className}`} data-category={glyph.category}>
      {/* MAIN: copy */}
      <button
        type="button"
        className="glyph-tile__main"
        onClick={() => onCopy(glyph)}
      >
        <span className="glyph-tile__symbol" aria-hidden="true">
          {glyph.symbol}
        </span>
        <span className="glyph-tile__name">{glyph.name}</span>
      </button>

      {/* FAVORITE */}
      <button
        type="button"
        className="glyph-tile__favorite"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(glyph);
        }}
      >
        ★
      </button>

      {/* DETAILS */}
      <button
        type="button"
        className="glyph-tile__details"
        onClick={(e) => {
          e.stopPropagation();
          onShowDetails(glyph);
        }}
      >
        ⋮
      </button>
    </div>
  );
}
