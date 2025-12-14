import { useMemo, useState } from "react";
import GlyphGrid from "@/components/GlyphGrid";
import UndoBar from "@/components/UndoBar";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import { clearFavorites, readFavoriteUnicodes, writeFavoriteUnicodes } from "@/utils/favorites";

export default function FavoritesPage() {
  const [undoSnapshot, setUndoSnapshot] = useState<string[] | null>(null);

  const favorites = useMemo(() => {
    const set = new Set(readFavoriteUnicodes());
    return (glyphsData as Glyph[]).filter((g) => set.has(g.unicode));
  }, [undoSnapshot]); // simple way to refresh when undo state changes; your existing event listeners also help

  const onClear = () => {
    const snapshot = clearFavorites();
    setUndoSnapshot(snapshot.length ? snapshot : null);
  };

  const onUndo = () => {
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
            onUndo={onUndo}
            onDismiss={() => setUndoSnapshot(null)}
          />
        )}

        <button type="button" onClick={onClear} disabled={favorites.length === 0}>
          Clear favorites
        </button>

        {favorites.length === 0 ? <p>No favorites yet.</p> : <GlyphGrid items={favorites} category="All" />}
      </div>
    </section>
  );
}