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
      {/* MAIN */}
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
        <svg
          className="icon icon--star"
          viewBox="0 -960 960 960"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="m371-320 109-64 110 64-30-121 95-81-125-11-50-116-50 117-125 10 96 80-30 122Zm109 26.54-146.61 87.84q-12.7 6.08-23.93 
            5.27-11.23-.81-20.3-6.88-9.08-6.08-12.93-18.27-3.84-12.19-.23-24.12l38.31-163.69-129.38-109.92q-10.7-7.69-12.81-19.5-2.12-11.81 
            1.11-22.12 3.23-10.3 13.31-18.07t21.62-8.39l168.3-14.84L443.85-762q5.84-13.31 15.15-18.77 9.31-5.46 21-5.46t21 5.46q9.31 5.46 
            15.15 18.77l67.39 156.85 168.3 13.84q11.54.62 21.62 8.89 10.08 8.27 13.31 18.57 3.23 10.31.61 21.62-2.61 11.31-13.31 
            19L645.69-413.31 684-249.62q3.61 11.93-.23 24.12-3.85 12.19-12.93 18.27-9.07 6.07-20.3 6.88-11.23.81-23.93-5.27L480-293.46ZM480-474Z"
          />
        </svg>
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
        <svg
          className="icon icon--details"
          viewBox="0 -960 960 960"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M479.63-171.23q-27.38 0-46.5-19.5Q414-210.23 414-237.6q0-27.38 19.5-46.51 
            19.49-19.12 46.87-19.12t46.5 19.5Q546-264.24 546-236.86t-19.5 46.5q-19.49 19.13-46.87 
            19.13Zm0-242.77q-27.38 0-46.5-19.5Q414-452.99 414-480.37t19.5-46.5Q452.99-546 480.37-546t46.5 
            19.5Q546-507.01 546-479.63t-19.5 46.5Q507.01-414 479.63-414Zm0-242.77q-27.38 0-46.5-19.5Q414-695.76 
            414-723.14t19.5-46.5q19.49-19.13 46.87-19.13t46.5 19.5Q546-749.77 546-722.4q0 27.38-19.5 
            46.51-19.49 19.12-46.87 19.12Z"
          />
        </svg>
      </button>
    </div>
  );
}