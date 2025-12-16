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
import "@/styles/emptyState.scss";

const EMPTY_EXIT_MS = 180;

export default function FavoritesPage() {
  const [favUnicodes, setFavUnicodes] = useState<string[]>(() =>
    readFavoriteUnicodes()
  );
  const [undoSnapshot, setUndoSnapshot] = useState<string[] | null>(null);

  // empty-state animation state
  const [showEmpty, setShowEmpty] = useState(() => readFavoriteUnicodes().length === 0);
  const [emptyEntering, setEmptyEntering] = useState(false);
  const [emptyLeaving, setEmptyLeaving] = useState(false);

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

  // drive empty-state mount/unmount with animation
  useEffect(() => {
    if (!hasFavorites) {
      setShowEmpty(true);
      setEmptyLeaving(false);
      setEmptyEntering(true);

      const raf = window.requestAnimationFrame(() => setEmptyEntering(false));
      return () => window.cancelAnimationFrame(raf);
    }

    // has favorites → animate empty-state out, then unmount
    if (showEmpty) {
      setEmptyLeaving(true);
      const t = window.setTimeout(() => {
        setShowEmpty(false);
        setEmptyLeaving(false);
      }, EMPTY_EXIT_MS);
      return () => window.clearTimeout(t);
    }
  }, [hasFavorites, showEmpty]);

  const handleClear = () => {
    const snapshot = clearFavorites();

    // Update UI immediately (in case the utility doesn't dispatch the event)
    setFavUnicodes([]);

    setUndoSnapshot(snapshot.length ? snapshot : null);
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    writeFavoriteUnicodes(undoSnapshot);
  };

  const handleDismiss = () => {
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
                onDismiss={handleDismiss}
                durationMs={5000}
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

        {showEmpty ? (
          <div
            className={[
              "empty-state",
              emptyEntering ? "is-entering" : "",
              emptyLeaving ? "is-leaving" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
            aria-live="polite"
          >
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
