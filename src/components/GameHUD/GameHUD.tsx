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
    <div className="flex items-center justify-between px-3 py-2 bg-slate-300 border-t-2 border-l-2 border-b-2 border-r-2 border-t-slate-500 border-l-slate-500 border-b-slate-100 border-r-slate-100 select-none">

      {/* Flags counter — inset display */}
      <div className="flex items-center gap-1 bg-black px-2 py-0.5 rounded-sm min-w-[3.5rem] justify-end">
        <span className="font-mono font-bold text-red-500 text-lg tabular-nums">
          {String(Math.max(0, flagsLeft)).padStart(3, '0')}
        </span>
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className={[
          'text-xl w-9 h-9 flex items-center justify-center',
          'bg-slate-300 border-t-2 border-l-2 border-b-2 border-r-2',
          'border-t-slate-100 border-l-slate-100 border-b-slate-500 border-r-slate-500',
          'hover:brightness-110 active:border-t-slate-500 active:border-l-slate-500',
          'active:border-b-slate-100 active:border-r-slate-100 cursor-pointer',
          'transition-[filter]',
        ].join(' ')}
        aria-label="Nowa gra"
        title="Nowa gra"
      >
        {resetEmoji(status)}
      </button>

      {/* Timer — inset display */}
      <div className="flex items-center gap-1 bg-black px-2 py-0.5 rounded-sm min-w-[3.5rem] justify-start">
        <span className="font-mono font-bold text-red-500 text-lg tabular-nums">
          {formatTime(elapsedTime).padStart(4, '0')}
        </span>
      </div>

    </div>
  );
};

export default GameHUD;
