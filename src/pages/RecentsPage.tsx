import { useMemo, useState } from "react";
import GlyphGrid from "@/components/GlyphGrid";
import UndoBar from "@/components/UndoBar";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import {
  clearRecents,
  readRecentUnicodes,
  writeRecentUnicodes,
} from "@/utils/recents";

export default function RecentsPage() {
  const [recentUnicodes, setRecentUnicodes] = useState<string[]>(() =>
    readRecentUnicodes()
  );
  const [undoSnapshot, setUndoSnapshot] = useState<string[] | null>(null);

  const recents = useMemo(() => {
    const map = new Map((glyphsData as Glyph[]).map((g) => [g.unicode, g]));
    return recentUnicodes
      .map((u) => map.get(u))
      .filter(Boolean) as Glyph[];
  }, [recentUnicodes]);

  const handleClear = () => {
    const snapshot = clearRecents();
    setUndoSnapshot(snapshot.length ? snapshot : null);
    setRecentUnicodes([]); // immediate UI update without relying on event
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    writeRecentUnicodes(undoSnapshot);
    setRecentUnicodes(undoSnapshot); // immediate UI restore, still stable order
    setUndoSnapshot(null);
  };

  return (
    <section className="section screen recents-screen" aria-label="Recents">
      <div className="section-wrapper">
        {undoSnapshot && (
          <UndoBar
            message="Recents cleared."
            onUndo={handleUndo}
            onDismiss={() => setUndoSnapshot(null)}
          />
        )}

        <button type="button" onClick={handleClear} disabled={recents.length === 0}>
          Clear recents
        </button>

        {recents.length === 0 ? (
          <p>No recents yet. Copy a glyph to add it here.</p>
        ) : (
          <GlyphGrid items={recents} category="All" />
        )}
      </div>
    </section>
  );
}