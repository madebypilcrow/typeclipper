import { useEffect, useMemo, useState } from "react";
import GlyphTile from "@/components/GlyphTile";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { useSearch } from "@/context/SearchContext";
import { readFavoriteUnicodes, toggleFavorite } from "@/utils/favorites";
import { pushRecent } from "@/utils/recents";
import { useToast } from "@/context/Toast";

import "@/styles/glyphGrid.scss";

type Props = {
  items?: Glyph[];
  category?: string | "All";
  className?: string;

  // Page-level modal opener (Glyphs/Favorites/Recents)
  onShowDetails: (g: Glyph) => void;
};

export default function GlyphGrid({
  items: itemsProp,
  category = "All",
  className = "",
  onShowDetails,
}: Props) {
  const { query } = useSearch();
  const { showToast } = useToast();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = (itemsProp ?? (glyphsData as Glyph[])) as Glyph[];

    const base = source.filter((g) =>
      category === "All" ? true : g.category === category
    );

    // Only the Glyphs page has search UI; other pages still have SearchProvider,
    // so we guard: if itemsProp is provided, we do not apply query filtering.
    if (itemsProp) return base;

    if (!q) return base;

    return base.filter((g) => {
      const symbol = (g.symbol ?? "").toLowerCase();
      const name = (g.name ?? "").toLowerCase();
      const html = (g.html ?? "").toLowerCase();
      const unicode = (g.unicode ?? "").toLowerCase();

      if (q.length <= 2) {
        const startsWord = (s: string) =>
          s
            .split(/[\s-_]+/)
            .some((part) => part.startsWith(q));

        return (
          symbol === q ||
          startsWord(name) ||
          startsWord(html) ||
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
      showToast(`Copied “${glyph.symbol}”`);
    } catch (err) {
      console.error("copy failed", err);
      showToast("Copy failed");
    }
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
    const next = toggleFavorite(glyph);
    setFavUnicodes(next);
  };

  return (
    <div className={`glyph-grid ${className ?? ""}`} role="list">
      {items.map((glyph) => (
        <GlyphTile
          key={glyph.unicode}
          glyph={glyph}
          isFavorite={favSet.has(glyph.unicode)}
          onCopy={handleCopy}
          onShowDetails={onShowDetails}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}