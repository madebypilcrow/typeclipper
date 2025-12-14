import { useEffect, useMemo, useState } from "react";
import GlyphTile from "@/components/GlyphTile";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { useSearch } from "@/context/SearchContext";
import { readFavoriteUnicodes, toggleFavorite } from "@/utils/favorites";
import { pushRecent } from "@/utils/recents";

import "@/styles/glyphGrid.scss";

type Props = {
  items?: Glyph[];
  category?: string | "All";
  className?: string;
};

export default function GlyphGrid({
  items: itemsProp,
  category = "All",
  className = "",
}: Props) {
  const { query } = useSearch();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    const source = (itemsProp ?? (glyphsData as Glyph[])) as Glyph[];

    const base = source.filter((g) =>
      category === "All" ? true : g.category === category
    );

    if (!q) return base;

    return base.filter((g) => {
      const symbol = (g.symbol ?? "").toLowerCase();
      const name = (g.name ?? "").toLowerCase();
      const html = (g.html ?? "").toLowerCase();
      const unicode = (g.unicode ?? "").toLowerCase();

      if (q.length <= 2) {
        return (
          symbol === q ||
          name.startsWith(q) ||
          html.startsWith(q) ||
          unicode.startsWith(q)
        );
      }

      const hay = `${symbol} ${name} ${html} ${unicode}`;
      return hay.includes(q);
    });
  }, [itemsProp, query, category]);

  const handleCopy = async (glyph: Glyph) => {
    try {
      await copyToClipboard(glyph.symbol);
      pushRecent(glyph);
      console.log("copied", glyph.symbol);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleShowDetails = (glyph: Glyph) => {
    console.log("details", glyph);
  };

  const [favUnicodes, setFavUnicodes] = useState<string[]>(() =>
    readFavoriteUnicodes()
  );

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

  const handleToggleFavorite = (glyph: Glyph) => {
    const next = toggleFavorite(glyph); // persists + dispatches event
    setFavUnicodes(next); // immediate UI update in this grid
  };

  return (
    <div className={`glyph-grid ${className ?? ""}`} role="list">
      {items.map((glyph) => (
        <GlyphTile
          key={glyph.unicode}
          glyph={glyph}
          isFavorite={favSet.has(glyph.unicode)}
          onCopy={handleCopy}
          onShowDetails={handleShowDetails}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}