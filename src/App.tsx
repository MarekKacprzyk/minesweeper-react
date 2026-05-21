import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ScoresPage from './pages/ScoresPage';

function App() {
  return (
    <BrowserRouter basename="/minesweeper-react">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/scores" element={<ScoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
