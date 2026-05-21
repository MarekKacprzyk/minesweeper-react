import { formatTime, formatDate, getDifficultyLabel } from '../../utils/scoreUtils';
import type { ScoreEntry } from '../../types/game';

interface ScoreTableProps {
  scores: ScoreEntry[];
}

const ScoreTable = ({ scores }: ScoreTableProps) => {
  if (scores.length === 0) {
    return (
      <p className="text-center text-slate-400 py-12 text-sm">
        Brak wyników — zagraj pierwszą grę!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-600 text-left">
            <th className="px-3 py-2 font-semibold w-8">#</th>
            <th className="px-3 py-2 font-semibold">Nick</th>
            <th className="px-3 py-2 font-semibold">Czas</th>
            <th className="px-3 py-2 font-semibold">Poziom</th>
            <th className="px-3 py-2 font-semibold">Rozmiar</th>
            <th className="px-3 py-2 font-semibold">Data</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, i) => (
            <tr
              key={entry.id}
              className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <td className="px-3 py-2 text-slate-400 font-mono">{i + 1}</td>
              <td className="px-3 py-2 font-semibold text-slate-800">{entry.nick}</td>
              <td className="px-3 py-2 font-mono text-indigo-600 font-bold">
                {formatTime(entry.time)}
              </td>
              <td className="px-3 py-2 text-slate-600">
                {getDifficultyLabel(entry.settings)}
              </td>
              <td className="px-3 py-2 text-slate-500 font-mono text-xs">
                {entry.settings.width}×{entry.settings.height} / {entry.settings.mines}💣
              </td>
              <td className="px-3 py-2 text-slate-400 text-xs">
                {formatDate(entry.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
