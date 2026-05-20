import SettingsForm from '../components/SettingsForm/SettingsForm';

const StartPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-3">💣</div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Minesweeper</h1>
          <p className="text-slate-500 text-sm mt-1">Wybierz poziom trudności i zagraj</p>
        </div>

        <SettingsForm />
      </div>
    </div>
  );
};

export default StartPage;
