import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRESETS } from '../../types/game';
import type { GameSettings } from '../../types/game';

interface FormValues {
  width: string;
  height: string;
  mines: string;
}

interface FormErrors {
  width?: string;
  height?: string;
  mines?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const w = parseInt(values.width, 10);
  const h = parseInt(values.height, 10);
  const m = parseInt(values.mines, 10);

  if (isNaN(w) || w < 5 || w > 30) {
    errors.width = 'Szerokość: 5–30';
  }
  if (isNaN(h) || h < 5 || h > 20) {
    errors.height = 'Wysokość: 5–20';
  }
  if (!errors.width && !errors.height) {
    const maxMines = w * h - 9;
    if (isNaN(m) || m < 1 || m > maxMines) {
      errors.mines = `Miny: 1–${maxMines}`;
    }
  } else if (isNaN(m) || m < 1) {
    errors.mines = 'Miny: min 1';
  }

  return errors;
}

function detectPreset(w: number, h: number, m: number): GameSettings['preset'] {
  for (const [key, preset] of Object.entries(PRESETS)) {
    if (preset.width === w && preset.height === h && preset.mines === m) {
      return key as GameSettings['preset'];
    }
  }
  return 'custom';
}

const PRESET_LABELS: Record<keyof typeof PRESETS, string> = {
  easy: 'Łatwy',
  medium: 'Średni',
  hard: 'Trudny',
};

const SettingsForm = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    width: String(PRESETS.easy.width),
    height: String(PRESETS.easy.height),
    mines: String(PRESETS.easy.mines),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS | null>('easy');

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setValues({ width: String(p.width), height: String(p.height), mines: String(p.mines) });
    setErrors({});
    setActivePreset(key);
  };

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = { ...values, [field]: e.target.value };
    setValues(newValues);

    const w = parseInt(newValues.width, 10);
    const h = parseInt(newValues.height, 10);
    const m = parseInt(newValues.mines, 10);
    if (!isNaN(w) && !isNaN(h) && !isNaN(m)) {
      setActivePreset(detectPreset(w, h, m) === 'custom' ? null : detectPreset(w, h, m) as keyof typeof PRESETS);
    } else {
      setActivePreset(null);
    }
  };

  const handlePlay = () => {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const w = parseInt(values.width, 10);
    const h = parseInt(values.height, 10);
    const m = parseInt(values.mines, 10);
    const settings: GameSettings = {
      width: w,
      height: h,
      mines: m,
      preset: detectPreset(w, h, m),
    };
    navigate('/game', { state: { settings } });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">

      {/* Preset buttons */}
      <div className="flex gap-3 w-full">
        {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map(key => (
          <button
            key={key}
            type="button"
            onClick={() => applyPreset(key)}
            className={[
              'flex-1 py-2 rounded-lg font-semibold text-sm transition-colors',
              activePreset === key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {PRESET_LABELS[key]}
            <span className="block text-xs font-normal opacity-70">
              {PRESETS[key].width}×{PRESETS[key].height} / {PRESETS[key].mines}💣
            </span>
          </button>
        ))}
      </div>

      {/* Custom inputs */}
      <div className="flex flex-col gap-4 w-full">
        {(
          [
            { field: 'width',  label: 'Szerokość', min: 5,  max: 30 },
            { field: 'height', label: 'Wysokość',  min: 5,  max: 20 },
            { field: 'mines',  label: 'Miny',      min: 1,  max: 999 },
          ] as const
        ).map(({ field, label, min, max }) => (
          <div key={field} className="flex flex-col gap-1">
            <label htmlFor={field} className="text-sm font-medium text-slate-700">
              {label}
            </label>
            <input
              id={field}
              type="number"
              min={min}
              max={max}
              value={values[field]}
              onChange={handleChange(field)}
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
                'focus:ring-2 focus:ring-indigo-400',
                errors[field]
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-300 bg-white',
              ].join(' ')}
            />
            {errors[field] && (
              <span className="text-xs text-red-500">{errors[field]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handlePlay}
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
        >
          💣 Graj
        </button>
        <button
          type="button"
          onClick={() => navigate('/scores')}
          className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-95 transition-all"
        >
          🏆 Wyniki
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;
