import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRESETS } from '../types/game';
import type { GameSettings } from '../types/game';
import useGame from '../hooks/useGame';
import useTimer from '../hooks/useTimer';
import useScores from '../hooks/useScores';
import Board from '../components/Board/Board';
import GameHUD from '../components/GameHUD/GameHUD';
import GameOverDialog from '../components/GameOverDialog/GameOverDialog';

const GamePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const settings: GameSettings = state?.settings ?? PRESETS.easy;

  const { state: gameState, handleCellClick, handleCellRightClick, resetGame } = useGame(settings);
  const { elapsedTime, resetTimer } = useTimer(gameState.status === 'playing');
  const { addScore } = useScores();

  // Reset timer whenever a new game starts
  useEffect(() => {
    if (gameState.status === 'idle') {
      resetTimer();
    }
  }, [gameState.status, resetTimer]);

  const handleReset = () => {
    resetGame();
    resetTimer();
  };

  const handleSaveScore = (nick: string) => {
    addScore({ nick, time: elapsedTime, settings });
    navigate('/scores');
  };

  const gameOver = gameState.status === 'won' || gameState.status === 'lost';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 gap-4">

      {/* Back to menu */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="self-start text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        ← Menu
      </button>

      {/* Game container — w-fit so HUD naturally matches board width */}
      <div className="flex flex-col items-center gap-2 w-fit max-w-full">
        {/* HUD stretches to fill the same width as Board below */}
        <div className="w-full">
          <GameHUD
            flagsLeft={gameState.flagsLeft}
            elapsedTime={elapsedTime}
            status={gameState.status}
            onReset={handleReset}
          />
        </div>

        {/* Board */}
        <Board
          board={gameState.board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          gameOver={gameOver}
        />
      </div>

      {/* Game over modal */}
      {gameOver && (
        <GameOverDialog
          status={gameState.status as 'won' | 'lost'}
          time={elapsedTime}
          settings={settings}
          onSaveScore={handleSaveScore}
          onRestart={handleReset}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  );
};

export default GamePage;
