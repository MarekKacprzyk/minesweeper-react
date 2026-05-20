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
    <div className="overflow-x-auto">
      <div
        className="inline-grid border border-slate-400 bg-slate-400 gap-px"
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
  );
};

export default Board;
