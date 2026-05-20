import { useState, useCallback } from 'react';
import type { GameSettings, GameState, Cell } from '../types/game';
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  revealAllMines,
  checkWin,
} from '../utils/boardUtils';

function buildInitialState(settings: GameSettings): GameState {
  return {
    board: createEmptyBoard(settings.width, settings.height),
    status: 'idle',
    flagsLeft: settings.mines,
    elapsedTime: 0,
    settings,
  };
}

const useGame = (settings: GameSettings) => {
  const [state, setState] = useState<GameState>(() => buildInitialState(settings));

  // ------------------------------------------------------------------
  // Left click — reveal cell
  // ------------------------------------------------------------------
  const handleCellClick = useCallback((x: number, y: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;

      const cell: Cell = prev.board[y][x];

      // Ignore already revealed or marked cells
      if (cell.isRevealed || cell.isFlagged || cell.isQuestionMark) return prev;

      let board = prev.board;
      let status = prev.status;

      // First click: place mines and calculate adjacency
      if (status === 'idle') {
        board = placeMines(board, settings.mines, x, y);
        board = calculateAdjacentMines(board);
        status = 'playing';
      }

      // Hit a mine → game over
      if (board[y][x].isMine) {
        return {
          ...prev,
          board: revealAllMines(board),
          status: 'lost',
        };
      }

      // Reveal the cell (BFS)
      const newBoard = revealCell(board, x, y);

      // Check win condition
      const newStatus = checkWin(newBoard) ? 'won' : status;

      return { ...prev, board: newBoard, status: newStatus };
    });
  }, [settings.mines]);

  // ------------------------------------------------------------------
  // Right click — cycle flag state: none → flag → ? → none
  // ------------------------------------------------------------------
  const handleCellRightClick = useCallback((x: number, y: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;

      const cell = prev.board[y][x];
      if (cell.isRevealed) return prev;

      const newBoard = prev.board.map(row => row.map(c => ({ ...c })));
      const target = newBoard[y][x];
      let flagsLeft = prev.flagsLeft;

      if (!target.isFlagged && !target.isQuestionMark) {
        // none → flag
        target.isFlagged = true;
        flagsLeft -= 1;
      } else if (target.isFlagged) {
        // flag → ?
        target.isFlagged = false;
        target.isQuestionMark = true;
        flagsLeft += 1;
      } else {
        // ? → none
        target.isQuestionMark = false;
      }

      return { ...prev, board: newBoard, flagsLeft };
    });
  }, []);

  // ------------------------------------------------------------------
  // Reset game
  // ------------------------------------------------------------------
  const resetGame = useCallback(() => {
    setState(buildInitialState(settings));
  }, [settings]);

  return { state, handleCellClick, handleCellRightClick, resetGame };
};

export default useGame;
