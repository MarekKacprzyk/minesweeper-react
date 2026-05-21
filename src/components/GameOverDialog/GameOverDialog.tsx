import { useState } from 'react';
import { formatTime } from '../../utils/scoreUtils';
import type { GameSettings } from '../../types/game';

interface GameOverDialogProps {
  status: 'won' | 'lost';
  time: number;
  settings: GameSettings;
  onSaveScore: (nick: string) => void;
  onRestart: () => void;
  onGoHome: () => void;
}

const GameOverDialog = ({
  status,
  time,
  settings,
  onSaveScore,
  onRestart,
  onGoHome,
}: GameOverDialogProps) => {
  const [nick, setNick] = useState('');
  const [nickError, setNickError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmed = nick.trim();
    if (!trimmed) {
      setNickError('Podaj nick');
      return;
    }
    if (trimmed.length > 20) {
      setNickError('Maksymalnie 20 znaków');
      return;
    }
    setNickError('');
    onSaveScore(trimmed);
    setSaved(true);
  };

  return (
    /* Overlay */
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">

        {status === 'won' ? (
          <>
            {/* ── WIN ── */}
            <div className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-slate-800">Wygrałeś!</h2>
              <p className="text-slate-500 text-sm mt-1">
                Czas: <span className="font-semibold text-slate-700">{formatTime(time)}</span>
                &nbsp;·&nbsp;
                {settings.width}×{settings.height}, {settings.mines} min
              </p>
            </div>

            {!saved ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="nick" className="text-sm font-medium text-slate-700">
                    Twój nick
                  </label>
                  <input
                    id="nick"
                    type="text"
                    maxLength={20}
                    placeholder="np. Jan"
                    value={nick}
                    onChange={e => setNick(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    autoFocus
                    className={[
                      'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
                      'focus:ring-2 focus:ring-indigo-400',
                      nickError ? 'border-red-400 bg-red-50' : 'border-slate-300',
                    ].join(' ')}
                  />
                  {nickError && (
                    <span className="text-xs text-red-500">{nickError}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  🏆 Zapisz wynik
                </button>
              </div>
            ) : (
              <p className="text-center text-green-600 font-semibold text-sm">
                ✅ Wynik zapisany!
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onRestart}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-95 transition-all"
              >
                🔄 Zagraj ponownie
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-95 transition-all"
              >
                🏠 Menu
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── LOSS ── */}
            <div className="text-center">
              <div className="text-5xl mb-2">💥</div>
              <h2 className="text-2xl font-bold text-slate-800">Przegrana!</h2>
              <p className="text-slate-500 text-sm mt-1">
                Czas: <span className="font-semibold text-slate-700">{formatTime(time)}</span>
                &nbsp;·&nbsp;
                {settings.width}×{settings.height}, {settings.mines} min
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onRestart}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all"
              >
                🔄 Zagraj ponownie
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-95 transition-all"
              >
                🏠 Menu
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default GameOverDialog;
