# Minesweeper — Specyfikacja Projektu

## Cel
Aplikacja webowa z grą Saper napisana w React + TypeScript. Projekt portfolio demonstrujący: architekturę komponentową, zarządzanie stanem, custom hooks, routing, persystencję danych i TypeScript.

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | React 18 |
| Język | TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Stylowanie | Tailwind CSS |
| Persystencja | localStorage |
| Linting | ESLint + Prettier |
| Hosting (opcjonalnie) | GitHub Pages / Vercel |

---

## Widoki (Routes)

### 1. `/` — Strona startowa
- Wybór poziomu trudności z presetów:
  - **Łatwy** — 9×9, 10 min
  - **Średni** — 16×16, 40 min
  - **Trudny** — 30×16, 99 min
- Możliwość ustawienia własnych parametrów:
  - Szerokość planszy (5–30)
  - Wysokość planszy (5–20)
  - Liczba min (1 – (w×h - 9), żeby zagwarantować bezpieczny start)
- Przycisk "Graj" → przejście do `/game`
- Przycisk "Wyniki" → przejście do `/scores`

### 2. `/game` — Plansza z grą
- Siatka komórek renderowana dynamicznie na podstawie wybranych ustawień
- Każda komórka: zakryta / odkryta / oflagowana
- Pierwsze kliknięcie zawsze bezpieczne (miny są rozmieszczane PO pierwszym kliknięciu, z wykluczeniem klikniętego pola i jego sąsiadów)
- Lewy klik — odkrycie komórki (kaskadowe odsłanianie pustych pól)
- Prawy klik — flaga (cykl: brak → flaga → znak zapytania → brak)
- Licznik flag (pozostałe miny) i timer (sekundy od pierwszego kliknięcia)
- Stany gry: `idle` | `playing` | `won` | `lost`
- Po wygranej — dialog z czasem + formularz do wpisania nicku + zapis do localStorage
- Po przegranej — ujawnienie wszystkich min + dialog z opcją restartu / powrotu do menu
- Przycisk powrotu do menu startowego

### 3. `/scores` — Tablica wyników
- Lista wyników z localStorage posortowana rosnąco po czasie
- Każdy wpis: nick, czas (sekundy), poziom trudności / rozmiar planszy, data
- Filtrowanie po poziomie trudności (preset lub "custom")
- Przycisk "Wyczyść wyniki" z potwierdzeniem
- Przycisk powrotu do menu

---

## Model danych

### Ustawienia gry (`GameSettings`)
```typescript
interface GameSettings {
  width: number;
  height: number;
  mines: number;
  preset: 'easy' | 'medium' | 'hard' | 'custom';
}
```

### Komórka (`Cell`)
```typescript
interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestionMark: boolean;
  adjacentMines: number;
}
```

### Wynik (`ScoreEntry`)
```typescript
interface ScoreEntry {
  id: string;          // crypto.randomUUID()
  nick: string;
  time: number;        // sekundy
  settings: GameSettings;
  date: string;        // ISO 8601
}
```

### Stan gry (`GameState`)
```typescript
type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface GameState {
  board: Cell[][];
  status: GameStatus;
  flagsLeft: number;
  elapsedTime: number;
  settings: GameSettings;
}
```

---

## Architektura plików

```
src/
├── components/
│   ├── Board/
│   │   ├── Board.tsx          # Siatka komórek
│   │   └── Board.module.css   # (opcjonalnie, jeśli potrzeba)
│   ├── Cell/
│   │   └── Cell.tsx           # Pojedyncza komórka
│   ├── GameHUD/
│   │   └── GameHUD.tsx        # Timer, flagi, status
│   ├── GameOverDialog/
│   │   └── GameOverDialog.tsx # Modal po wygranej/przegranej
│   ├── ScoreTable/
│   │   └── ScoreTable.tsx     # Tabela wyników
│   └── SettingsForm/
│       └── SettingsForm.tsx   # Formularz ustawień
├── hooks/
│   ├── useGame.ts             # Główna logika gry
│   ├── useTimer.ts            # Odliczanie czasu
│   └── useScores.ts           # CRUD na localStorage
├── pages/
│   ├── StartPage.tsx
│   ├── GamePage.tsx
│   └── ScoresPage.tsx
├── types/
│   └── game.ts                # Wszystkie interfejsy
├── utils/
│   ├── boardUtils.ts          # Generowanie planszy, flood fill, walidacja
│   └── scoreUtils.ts          # Sortowanie, formatowanie
├── App.tsx
└── main.tsx
```

---

## Logika gry — kluczowe algorytmy

### Generowanie planszy
1. Stwórz pustą siatkę `width × height`
2. Przy pierwszym kliknięciu na pole `(x, y)` — rozlokuj miny losowo z wykluczeniem `(x, y)` i jego 8 sąsiadów
3. Dla każdej komórki oblicz `adjacentMines` (sumę min w sąsiadach)

### Odkrywanie (flood fill / BFS)
- Jeśli odkryte pole ma `adjacentMines === 0` — rekurencyjnie odkryj wszystkich sąsiadów
- Zatrzymaj się na polach z `adjacentMines > 0` (odkryj, ale nie propaguj dalej)
- Jeśli pole jest miną — `status = 'lost'`

### Warunek wygranej
- Liczba zakrytych pól === liczba min (wszystkie nie-minowe pola odkryte)

---

## Persystencja (localStorage)

Klucz: `minesweeper_scores`  
Format: `JSON.stringify(ScoreEntry[])`  
Limit: brak — przy dużej liczbie wpisów można dodać cap (np. top 100 per preset)

---

## Walidacja ustawień

- `width`: 5–30
- `height`: 5–20
- `mines`: min 1, max `width × height - 9` (gwarantuje bezpieczny start)
- Formularz blokuje nieprawidłowe wartości z komunikatem inline

---

## Wymagania niefunkcjonalne

- Responsywność: gra powinna działać na ekranach >= 375px (mobile); dla dużych plansz — horizontal scroll
- Dostępność: obsługa klawiatury dla przycisków (nie wymaga pełnego A11y dla komórek gry)
- Brak zewnętrznych bibliotek do logiki gry — tylko React + TypeScript
- Kod w TypeScript bez `any`

---

## Opcjonalne rozszerzenia (nice to have, po MVP)

- Animacje odkrywania komórek (CSS transitions)
- Dark/light mode
- Eksport wyników do CSV
- Deploy na GitHub Pages z CI/CD przez GitHub Actions
- Unit testy dla `boardUtils.ts` (Vitest)
