import type { Cell as CellType } from '../../types/game';

interface CellProps {
  cell: CellType;
  onLeftClick: () => void;
  onRightClick: () => void;
  gameOver: boolean;
}

/** Tailwind colour classes for digits 1–8 (index = adjacentMines) */
const DIGIT_COLORS: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-blue-900',
  5: 'text-red-900',
  6: 'text-cyan-600',
  7: 'text-black',
  8: 'text-slate-500',
};

function getCellContent(cell: CellType, gameOver: boolean): React.ReactNode {
  if (!cell.isRevealed) {
    if (cell.isFlagged)      return '🚩';
    if (cell.isQuestionMark) return '❓';
    return null;
  }
  if (cell.isMine) return '💣';
  if (cell.adjacentMines > 0) {
    return (
      <span className={`font-bold text-sm select-none ${DIGIT_COLORS[cell.adjacentMines] ?? 'text-black'}`}>
        {cell.adjacentMines}
      </span>
    );
  }
  return null;
}

function getCellClasses(cell: CellType, gameOver: boolean): string {
  const base =
    'w-8 h-8 flex items-center justify-center text-base leading-none border transition-colors';

  if (!cell.isRevealed) {
    return [
      base,
      'bg-slate-300 border-slate-400',
      gameOver
        ? 'cursor-default'
        : 'hover:bg-slate-200 active:bg-slate-400 cursor-pointer',
    ].join(' ');
  }

  // Revealed mine
  if (cell.isMine) {
    return `${base} bg-red-400 border-red-500 cursor-default`;
  }

  // Revealed empty / numbered
  return [
    base,
    'border-slate-300 cursor-default',
    cell.adjacentMines === 0 ? 'bg-slate-100' : 'bg-slate-50',
  ].join(' ');
}

const Cell = ({ cell, onLeftClick, onRightClick, gameOver }: CellProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gameOver) onRightClick();
  };

  const handleClick = () => {
    if (!gameOver) onLeftClick();
  };

  return (
    <button
      type="button"
      className={getCellClasses(cell, gameOver)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      // Disable default browser long-press context menu on touch devices
      onTouchStart={e => e.preventDefault()}
      aria-label={
        cell.isRevealed
          ? cell.isMine
            ? 'Mina'
            : `${cell.adjacentMines}`
          : cell.isFlagged
          ? 'Oflagowane'
          : cell.isQuestionMark
          ? 'Znak zapytania'
          : 'Zakryte'
      }
    >
      {getCellContent(cell, gameOver)}
    </button>
  );
};

export default Cell;
