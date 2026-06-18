import { Play, Square, Coffee, Brain } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';

interface FocusTimerProps {
  pomodoro: ReturnType<typeof usePomodoro>;
  onEnterZenMode?: () => void;
}

export default function FocusTimer({ pomodoro, onEnterZenMode }: FocusTimerProps) {
  const { mode, timeLeft, isActive, startFocus, startBreak, stopTimer, formatTime } = pomodoro;

  // Calculate percentage for progress circle
  const totalSeconds = mode === 'focus' ? 25 * 60 : 5 * 60;
  const percentage = (timeLeft / totalSeconds) * 100;
  
  return (
    <div className={`relative rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-500 ${
      mode === 'focus' 
        ? 'bg-gradient-to-br from-primary-900/40 to-[#1a1a1c] ring-1 ring-primary-500/30' 
        : mode === 'break'
          ? 'bg-gradient-to-br from-green-900/30 to-[#1a1a1c] ring-1 ring-green-500/30'
          : 'bg-[#1a1a1c] ring-1 ring-white/10'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${
        mode === 'focus' ? 'bg-primary-500' : mode === 'break' ? 'bg-green-500' : 'bg-white/5'
      }`} />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
            {mode === 'focus' ? (
              <><Brain className="w-5 h-5 text-primary-400" /> Focus Mode</>
            ) : mode === 'break' ? (
              <><Coffee className="w-5 h-5 text-green-400" /> Break Time</>
            ) : (
              <><Brain className="w-5 h-5 text-white/40" /> Pomodoro Timer</>
            )}
          </h2>
          <p className="text-xs text-white/50 mt-1">
            {mode === 'focus' ? 'Deep work in progress. Notifications silenced.' : mode === 'break' ? 'Relax and stretch!' : 'Start a 25m focus session.'}
          </p>
        </div>

        {/* Circular Progress + Time */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              className="fill-none stroke-white/5 stroke-[4px]"
            />
            {isActive && (
              <circle
                cx="40"
                cy="40"
                r="36"
                className={`fill-none stroke-[4px] transition-all duration-1000 ease-linear ${
                  mode === 'focus' ? 'stroke-primary-500' : 'stroke-green-500'
                }`}
                strokeDasharray="226"
                strokeDashoffset={226 - (226 * percentage) / 100}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="text-xl font-bold tracking-tight font-mono text-white/90">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 mt-6">
        {mode === 'idle' ? (
          <button
            onClick={startFocus}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors shadow-lg shadow-primary-500/25"
          >
            <Play className="w-4 h-4" /> Start Focus
          </button>
        ) : (
          <>
            <button
              onClick={stopTimer}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
            {mode === 'focus' && (
              <>
                <button
                  onClick={startBreak}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-white text-sm font-medium transition-colors border border-white/10 hover:border-green-500/30"
                  title="Skip to break"
                >
                  <Coffee className="w-4 h-4" />
                </button>
                {onEnterZenMode && (
                  <button
                    onClick={onEnterZenMode}
                    className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm font-medium transition-colors ring-1 ring-primary-500/30"
                  >
                    Enter Zen Mode
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
