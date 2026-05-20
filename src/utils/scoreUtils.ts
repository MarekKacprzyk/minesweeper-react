import type { GameSettings } from '../types/game';

/**
 * Formats elapsed seconds as M:SS  e.g. 65 → "1:05", 9 → "0:09"
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats an ISO 8601 date string as DD.MM.YYYY  e.g. "2024-01-15T10:30:00.000Z" → "15.01.2024"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Returns a human-readable difficulty label.
 * Preset names map to Polish labels; custom settings show dimensions.
 * e.g. "Łatwy" | "Średni" | "Trudny" | "Custom 20×15"
 */
export function getDifficultyLabel(settings: GameSettings): string {
  switch (settings.preset) {
    case 'easy':   return 'Łatwy';
    case 'medium': return 'Średni';
    case 'hard':   return 'Trudny';
    case 'custom': return `Custom ${settings.width}×${settings.height}`;
  }
}
