import Cell from '../Cell/Cell';
import type { Cell as CellType } from '../../types/game';

interface BoardProps {
  board: CellType[][];
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
  gameOver: boolean;
}

const Board = ({ board, onCellClick, onCellRightClick, gameOver }: BoardProps) => {
  const width = board[0]?.length ?? 0;

  return (
    <div className="overflow-x-auto max-w-full">
      {/* Outer border — classic raised bevel around the whole board */}
      <div className="inline-block border-t-2 border-l-2 border-b-2 border-r-2 border-t-slate-100 border-l-slate-100 border-b-slate-500 border-r-slate-500 bg-slate-300 p-1">
        <div
          className="inline-grid"
          style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
        >
          {board.map(row =>
            row.map(cell => (
              <Cell
                key={`${cell.x}-${cell.y}`}
                cell={cell}
                onLeftClick={() => onCellClick(cell.x, cell.y)}
                onRightClick={() => onCellRightClick(cell.x, cell.y)}
                gameOver={gameOver}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
