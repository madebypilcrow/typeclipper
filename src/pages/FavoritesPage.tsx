import { useEffect, useMemo, useState } from "react";
import GlyphGrid from "@/components/GlyphGrid";
import UndoBar from "@/components/UndoBar";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import {
  clearFavorites,
  readFavoriteUnicodes,
  writeFavoriteUnicodes,
} from "@/utils/favorites";

export default function FavoritesPage() {
  const [favUnicodes, setFavUnicodes] = useState<string[]>(() =>
    readFavoriteUnicodes()
  );
  const [undoSnapshot, setUndoSnapshot] = useState<string[] | null>(null);

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

  const favorites = useMemo(() => {
    const map = new Map((glyphsData as Glyph[]).map((g) => [g.unicode, g]));
    return favUnicodes
      .map((u) => map.get(u))
      .filter(Boolean) as Glyph[];
  }, [favUnicodes]);

  const handleClear = () => {
    const snapshot = clearFavorites();
    setUndoSnapshot(snapshot.length ? snapshot : null);
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    writeFavoriteUnicodes(undoSnapshot);
    setUndoSnapshot(null);
  };

  return (
    <section className="section" aria-label="Favorites">
      <div className="section-wrapper">
        {undoSnapshot && (
          <UndoBar
            message="Favorites cleared."
            onUndo={handleUndo}
            onDismiss={() => setUndoSnapshot(null)}
          />
        )}

        <button
          type="button"
          onClick={handleClear}
          disabled={favorites.length === 0}
        >
          Clear favorites
        </button>

        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <GlyphGrid items={favorites} category="All" />
        )}
      </div>
    </section>
  );
}