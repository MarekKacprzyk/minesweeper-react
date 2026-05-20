import type { Cell } from '../types/game';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns all existing neighbours of cell (x, y) — up to 8 cells.
 */
export function getNeighbors(board: Cell[][], x: number, y: number): Cell[] {
  const neighbors: Cell[] = [];
  const height = board.length;
  const width = board[0].length;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        neighbors.push(board[ny][nx]);
      }
    }
  }

  return neighbors;
}

// ---------------------------------------------------------------------------
// Board creation
// ---------------------------------------------------------------------------

/**
 * Creates an empty width × height board — all cells hidden, no mines.
 */
export function createEmptyBoard(width: number, height: number): Cell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x): Cell => ({
      x,
      y,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestionMark: false,
      adjacentMines: 0,
    }))
  );
}

/**
 * Places `mines` mines on a deep-copied board, excluding (safeX, safeY)
 * and its 8 neighbours (guarantees a safe first click).
 */
export function placeMines(
  board: Cell[][],
  mines: number,
  safeX: number,
  safeY: number
): Cell[][] {
  const height = board.length;
  const width = board[0].length;

  // Build the set of forbidden positions
  const forbidden = new Set<string>();
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = safeX + dx;
      const ny = safeY + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        forbidden.add(`${nx},${ny}`);
      }
    }
  }

  // Collect all candidate positions
  const candidates: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!forbidden.has(`${x},${y}`)) {
        candidates.push([x, y]);
      }
    }
  }

  // Fisher-Yates shuffle, take first `mines` entries
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Deep-copy board and place mines
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  for (let i = 0; i < mines; i++) {
    const [x, y] = candidates[i];
    newBoard[y][x].isMine = true;
  }

  return newBoard;
}

/**
 * Fills in adjacentMines for every cell on a deep-copied board.
 */
export function calculateAdjacentMines(board: Cell[][]): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const height = newBoard.length;
  const width = newBoard[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (newBoard[y][x].isMine) continue;
      newBoard[y][x].adjacentMines = getNeighbors(newBoard, x, y).filter(
        c => c.isMine
      ).length;
    }
  }

  return newBoard;
}

// ---------------------------------------------------------------------------
// Game logic
// ---------------------------------------------------------------------------

/**
 * Reveals cell (x, y). If the cell has no adjacent mines, flood-fills
 * (BFS) to reveal all connected empty cells and their numbered borders.
 * Returns a deep-copied board with the new state.
 */
export function revealCell(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[y][x];

  // Do nothing if already revealed or flagged / question-marked
  if (cell.isRevealed || cell.isFlagged || cell.isQuestionMark) return newBoard;

  const queue: Cell[] = [cell];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.isRevealed) continue;
    current.isRevealed = true;

    // Propagate only through empty (0-adjacent) non-mine cells
    if (!current.isMine && current.adjacentMines === 0) {
      const neighbors = getNeighbors(newBoard, current.x, current.y);
      for (const neighbor of neighbors) {
        if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isQuestionMark) {
          queue.push(neighbor);
        }
      }
    }
  }

  return newBoard;
}

/**
 * Returns true when every non-mine cell has been revealed (win condition).
 */
export function checkWin(board: Cell[][]): boolean {
  return board.every(row =>
    row.every(cell => cell.isMine || cell.isRevealed)
  );
}

/**
 * Reveals all mines — called on game loss to show the full board.
 * Returns a deep-copied board.
 */
export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map(row =>
    row.map(cell =>
      cell.isMine ? { ...cell, isRevealed: true } : { ...cell }
    )
  );
}
