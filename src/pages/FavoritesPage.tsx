import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import GlyphGrid from "@/components/GlyphGrid";
import UndoBar from "@/components/UndoBar";
import Button from "@/components/Button";
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
    return favUnicodes.map((u) => map.get(u)).filter(Boolean) as Glyph[];
  }, [favUnicodes]);

  const hasFavorites = favorites.length > 0;

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
    <section
      className="section screen favorites-screen"
      aria-labelledby="favorites-title"
    >
      <div className="section-wrapper screen__wrapper">
        <div className="screen__header screen__header--has-action">
          <h1 id="favorites-title" className="screen__title">
            Favorites
          </h1>

          <div className="screen__action-slot" aria-live="polite">
            {undoSnapshot ? (
              <UndoBar
                message="Favorites cleared."
                onUndo={handleUndo}
                onDismiss={() => setUndoSnapshot(null)}
              />
            ) : hasFavorites ? (
              <button
                type="button"
                className="screen__action"
                onClick={handleClear}
              >
                Clear All
              </button>
            ) : null}
          </div>
        </div>

        {!hasFavorites ? (
          <div className="empty-state" role="status" aria-live="polite">
            <div className="empty-state__mark" aria-hidden="true">
              ⋆⁺₊⋆ ☾⋆⁺₊⋆
            </div>

            <p className="empty-state__text">
              No favorites yet. Open any character’s details and tap the ☆ to
              add it here.
            </p>

            <Button as={Link} to="/">
              Explore characters
            </Button>
          </div>
        ) : (
          <GlyphGrid items={favorites} category="All" />
        )}
      </div>
    </section>
  );
}