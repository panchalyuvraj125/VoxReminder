import { useEffect } from 'react';
import { playAmbientBrownNoise } from '../../utils/audioEngine';
import type { usePomodoro } from '../../hooks/usePomodoro';

interface ZenModeProps {
  pomodoro: ReturnType<typeof usePomodoro>;
  onExit: () => void;
}

export default function ZenMode({ pomodoro, onExit }: ZenModeProps) {
  const isPlayingNoise = pomodoro.mode === 'focus';

  useEffect(() => {
    // We only play noise during Focus mode, not Break mode
    if (pomodoro.mode === 'focus') {
      const stopNoise = playAmbientBrownNoise();
      return () => {
        stopNoise();
      };
    }
  }, [pomodoro.mode]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
      
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
        
        {/* Status Text */}
        <div className="text-white/40 tracking-[0.3em] uppercase text-sm font-medium">
          {pomodoro.mode === 'focus' ? 'Deep Work Session' : pomodoro.mode === 'break' ? 'Rest Session' : 'Zen Mode'}
        </div>

        {/* Massive Minimalist Timer */}
        <div className="text-[12rem] font-light text-white tracking-tighter leading-none font-mono">
          {pomodoro.formatTime(pomodoro.timeLeft)}
        </div>

        {/* Ambient Noise Indicator */}
        <div className={`text-xs text-white/30 flex items-center gap-2 transition-opacity duration-1000 ${isPlayingNoise ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-[2px] h-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-[2px] bg-primary-500/50 rounded-full animate-waveform" style={{ animationDelay: `${i * 0.15}s`, height: '100%' }} />
            ))}
          </div>
          Ambient noise active
        </div>

      </div>

      {/* Subtle Exit Button */}
      <button 
        onClick={onExit}
        className="absolute bottom-12 px-6 py-2 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-full transition-all text-sm tracking-wide"
      >
        Exit Zen Mode
      </button>

      {/* Global CSS for waveform */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes waveform {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-waveform {
          animation: waveform 1s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </div>
  );
}
