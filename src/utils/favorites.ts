import type { Glyph } from "@/types/glyph";

const KEY = "typeclipper:favorites";

export function readFavoriteUnicodes(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavoriteUnicodes(unicodes: string[]): void {
  localStorage.setItem(KEY, JSON.stringify(unicodes));
  window.dispatchEvent(new CustomEvent("typeclipper:favorites-changed"));
}

export function isFavoriteUnicode(unicode: string): boolean {
  return readFavoriteUnicodes().includes(unicode);
}

export function toggleFavorite(glyph: Glyph): string[] {
  const unicode = glyph.unicode;
  const current = readFavoriteUnicodes();
  const set = new Set(current);

  if (set.has(unicode)) set.delete(unicode);
  else set.add(unicode);

  const next = Array.from(set);
  localStorage.setItem(KEY, JSON.stringify(next));

  window.dispatchEvent(new CustomEvent("typeclipper:favorites-changed"));
  return next;
}

export function clearFavorites(): string[] {
  const snapshot = readFavoriteUnicodes();
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("typeclipper:favorites-changed"));
  return snapshot;
}