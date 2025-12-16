import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import GlyphGrid from "@/components/GlyphGrid";
import UndoBar from "@/components/UndoBar";
import Button from "@/components/Button";
import type { Glyph } from "@/types/glyph";
import glyphsData from "@/data/glyphs.json";
import {
  clearRecents,
  readRecentUnicodes,
  writeRecentUnicodes,
} from "@/utils/recents";

export default function RecentsPage() {
  // snapshot at mount; intentionally NOT reactive
  const [recentUnicodes, setRecentUnicodes] = useState<string[]>(() =>
    readRecentUnicodes()
  );
  const [undoSnapshot, setUndoSnapshot] = useState<string[] | null>(null);

  const recents = useMemo(() => {
    const map = new Map((glyphsData as Glyph[]).map((g) => [g.unicode, g]));
    return recentUnicodes.map((u) => map.get(u)).filter(Boolean) as Glyph[];
  }, [recentUnicodes]);

  const hasRecents = recents.length > 0;

  const handleClear = () => {
    const snapshot = clearRecents();

    // freeze UI to empty; no live reordering
    setRecentUnicodes([]);

    setUndoSnapshot(snapshot.length ? snapshot : null);
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;

    writeRecentUnicodes(undoSnapshot);

    // restore snapshot exactly as it was
    setRecentUnicodes(undoSnapshot);
    // UndoBar will dismiss itself
  };

  const handleDismiss = () => {
    setUndoSnapshot(null);
  };

  return (
    <section
      className="section screen recents-screen"
      aria-labelledby="recents-title"
    >
      <div className="section-wrapper screen__wrapper">
        <div className="screen__header screen__header--has-action">
          <h1 id="recents-title" className="screen__title">
            Recents
          </h1>

          <div className="screen__action-slot" aria-live="polite">
            {undoSnapshot ? (
              <UndoBar
                message="Recents cleared."
                onUndo={handleUndo}
                onDismiss={handleDismiss}
                durationMs={5000}
              />
            ) : hasRecents ? (
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

        {!hasRecents ? (
          <div className="empty-state" role="status" aria-live="polite">
            <div className="empty-state__mark" aria-hidden="true">
              (¬‿¬)
            </div>

            <p className="empty-state__text">
              No characters copied yet. Copy any character to see it here.
            </p>

            <Button as={Link} to="/">
              Explore characters
            </Button>
          </div>
        ) : (
          <GlyphGrid items={recents} category="All" />
        )}
      </div>
    </section>
  );
}
