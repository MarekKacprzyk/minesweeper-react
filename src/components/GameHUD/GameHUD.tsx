import { formatTime } from '../../utils/scoreUtils';
import type { GameStatus } from '../../types/game';

interface GameHUDProps {
  flagsLeft: number;
  elapsedTime: number;
  status: GameStatus;
  onReset: () => void;
}

function resetEmoji(status: GameStatus): string {
  switch (status) {
    case 'won':  return '😎';
    case 'lost': return '😵';
    default:     return '🙂';
  }
}

const GameHUD = ({ flagsLeft, elapsedTime, status, onReset }: GameHUDProps) => {
  return (
    <div className="flex items-center justify-between w-full px-3 py-2 bg-slate-200 border border-slate-400 rounded-lg select-none">

      {/* Flags counter */}
      <div className="flex items-center gap-1 min-w-[4rem]">
        <span className="text-lg">🚩</span>
        <span className="font-mono font-bold text-slate-800 text-lg w-8 text-right">
          {flagsLeft}
        </span>
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className="text-2xl leading-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        aria-label="Nowa gra"
        title="Nowa gra"
      >
        {resetEmoji(status)}
      </button>

      {/* Timer */}
      <div className="flex items-center gap-1 min-w-[4rem] justify-end">
        <span className="text-lg">⏱️</span>
        <span className="font-mono font-bold text-slate-800 text-lg w-10 text-right">
          {formatTime(elapsedTime)}
        </span>
      </div>

    </div>
  );
};

export default GameHUD;
