import type { Cell as CellType } from '../../types/game';

interface CellProps {
  cell: CellType;
  onLeftClick: () => void;
  onRightClick: () => void;
  gameOver: boolean;
}

/** Standard Minesweeper digit colours */
const DIGIT_COLORS: Record<number, string> = {
  1: 'text-blue-700',
  2: 'text-green-700',
  3: 'text-red-600',
  4: 'text-blue-900',
  5: 'text-red-900',
  6: 'text-cyan-700',
  7: 'text-black',
  8: 'text-slate-500',
};

function getCellContent(cell: CellType): React.ReactNode {
  if (!cell.isRevealed) {
    if (cell.isFlagged)      return <span className="text-base leading-none select-none">🚩</span>;
    if (cell.isQuestionMark) return <span className="text-sm font-bold select-none text-slate-600">?</span>;
    return null;
  }
  if (cell.isMine) return <span className="text-base leading-none select-none">💣</span>;
  if (cell.adjacentMines > 0) {
    return (
      <span className={`font-bold text-sm leading-none select-none ${DIGIT_COLORS[cell.adjacentMines] ?? 'text-black'}`}>
        {cell.adjacentMines}
      </span>
    );
  }
  return null;
}

function getCellClasses(cell: CellType, gameOver: boolean): string {
  const base = 'w-8 h-8 flex items-center justify-center transition-colors focus:outline-none';

  if (!cell.isRevealed) {
    // Classic raised 3-D bevel: light top-left edge, dark bottom-right edge
    return [
      base,
      'bg-slate-300',
      'border-t-2 border-l-2 border-b-2 border-r-2',
      'border-t-slate-100 border-l-slate-100 border-b-slate-500 border-r-slate-500',
      gameOver ? 'cursor-default' : 'hover:bg-slate-200 active:bg-slate-300 cursor-pointer',
    ].join(' ');
  }

  // Revealed mine
  if (cell.isMine) {
    return `${base} bg-red-400 border border-red-600 cursor-default`;
  }

  // Revealed — flat / sunken
  return [
    base,
    'border border-slate-400 cursor-default',
    cell.adjacentMines === 0 ? 'bg-slate-200' : 'bg-slate-100',
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
      onTouchStart={e => e.preventDefault()}
      aria-label={
        cell.isRevealed
          ? cell.isMine
            ? 'Mina'
            : cell.adjacentMines > 0
            ? `${cell.adjacentMines}`
            : 'Odkryte'
          : cell.isFlagged
          ? 'Oflagowane'
          : cell.isQuestionMark
          ? 'Znak zapytania'
          : 'Zakryte'
      }
    >
      {getCellContent(cell)}
    </button>
  );
};

export default Cell;
