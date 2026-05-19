export interface GameSettings {
  width: number;
  height: number;
  mines: number;
  preset: 'easy' | 'medium' | 'hard' | 'custom';
}

export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestionMark: boolean;
  adjacentMines: number;
}

export interface ScoreEntry {
  id: string;
  nick: string;
  time: number;
  settings: GameSettings;
  date: string;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
  board: Cell[][];
  status: GameStatus;
  flagsLeft: number;
  elapsedTime: number;
  settings: GameSettings;
}

export const PRESETS: Record<'easy' | 'medium' | 'hard', GameSettings> = {
  easy: { width: 9, height: 9, mines: 10, preset: 'easy' },
  medium: { width: 16, height: 16, mines: 40, preset: 'medium' },
  hard: { width: 30, height: 16, mines: 99, preset: 'hard' },
};
