import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScores from '../hooks/useScores';
import ScoreTable from '../components/ScoreTable/ScoreTable';
import type { GameSettings } from '../types/game';

type FilterKey = 'all' | GameSettings['preset'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',    label: 'Wszystkie' },
  { key: 'easy',   label: 'Łatwy' },
  { key: 'medium', label: 'Średni' },
  { key: 'hard',   label: 'Trudny' },
  { key: 'custom', label: 'Custom' },
];

const ScoresPage = () => {
  const navigate = useNavigate();
  const { scores, clearScores } = useScores();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered =
    filter === 'all' ? scores : scores.filter(s => s.settings.preset === filter);

  const handleClear = () => {
    if (window.confirm('Na pewno wyczyścić wszystkie wyniki?')) {
      clearScores();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 gap-6">

      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Menu
        </button>
        <h1 className="text-2xl font-bold text-slate-800">🏆 Wyniki</h1>
        <button
          type="button"
          onClick={handleClear}
          disabled={scores.length === 0}
          className="text-sm text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Wyczyść
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {FILTERS.map(({ key, label }) => {
          const count = key === 'all'
            ? scores.length
            : scores.filter(s => s.settings.preset === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                filter === key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300',
              ].join(' ')}
            >
              {label}
              <span className="ml-1.5 opacity-70 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <ScoreTable scores={filtered} />
      </div>

    </div>
  );
};

export default ScoresPage;
