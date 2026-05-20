import { useState, useCallback } from 'react';
import type { ScoreEntry, GameSettings } from '../types/game';

const STORAGE_KEY = 'minesweeper_scores';

function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as ScoreEntry[]).sort((a, b) => a.time - b.time);
  } catch {
    return [];
  }
}

function saveScores(scores: ScoreEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

const useScores = () => {
  const [scores, setScores] = useState<ScoreEntry[]>(loadScores);

  const addScore = useCallback(
    (entry: Omit<ScoreEntry, 'id' | 'date'>) => {
      const newEntry: ScoreEntry = {
        ...entry,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      setScores(prev => {
        const updated = [...prev, newEntry].sort((a, b) => a.time - b.time);
        saveScores(updated);
        return updated;
      });
    },
    []
  );

  const clearScores = useCallback(() => {
    setScores([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getScoresByPreset = useCallback(
    (preset: GameSettings['preset']): ScoreEntry[] =>
      scores.filter(s => s.settings.preset === preset),
    [scores]
  );

  return { scores, addScore, clearScores, getScoresByPreset };
};

export default useScores;
