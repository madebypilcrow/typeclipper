import type { Glyph } from "@/types/glyph";

const KEY = "typeclipper:recents";
const MAX_RECENTS = 60;

export function readRecentUnicodes(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeRecentUnicodes(unicodes: string[]): void {
  localStorage.setItem(KEY, JSON.stringify(unicodes));
  window.dispatchEvent(new CustomEvent("typeclipper:recents-changed"));
}

export function pushRecent(glyph: Glyph): string[] {
  const unicode = glyph.unicode;
  const current = readRecentUnicodes().filter((u) => u !== unicode);
  const next = [unicode, ...current].slice(0, MAX_RECENTS);

  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("typeclipper:recents-changed"));

  return next;
}

export function clearRecents(): string[] {
  const snapshot = readRecentUnicodes();
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("typeclipper:recents-changed"));
  return snapshot;
}
