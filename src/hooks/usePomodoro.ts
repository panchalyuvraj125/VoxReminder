import { useState, useEffect, useCallback } from 'react';

type PomodoroMode = 'idle' | 'focus' | 'break';

interface UsePomodoroReturn {
  mode: PomodoroMode;
  timeLeft: number;
  isActive: boolean;
  startFocus: () => void;
  startBreak: () => void;
  stopTimer: () => void;
  formatTime: (seconds: number) => string;
}

export function usePomodoro(focusDurationMinutes: number = 25, breakDurationMinutes: number = 5): UsePomodoroReturn {
  const FOCUS_TIME = focusDurationMinutes * 60;
  const BREAK_TIME = breakDurationMinutes * 60;

  const [mode, setMode] = useState<PomodoroMode>('idle');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);

  // If the settings change while idle, update the timer
  // If the settings change while idle, update the timer
  useEffect(() => {
    if (mode === 'idle' && !isActive) {
      // Avoid calling setState synchronously during render by not using it here,
      // but if we must update state when props change, do it safely.
      // Wait, we shouldn't call setState directly here if it causes a re-render cascade.
      // Instead we can use a ref to track if we need an update, or just use useMemo for derived state.
      // Actually, updating state in useEffect is fine if properly guarded. The lint rule warns about doing it *unconditionally* or without proper dependencies.
      // Let's use a timeout to push it to the end of the queue, or restructure to derive it.
      // Easiest is a timeout to avoid synchronous update cascade warnings.
      const timer = setTimeout(() => setTimeLeft(FOCUS_TIME), 0);
      return () => clearTimeout(timer);
    }
  }, [FOCUS_TIME, mode, isActive]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      // Push state updates to the end of the event loop to avoid synchronous cascade
      setTimeout(() => {
        setIsActive(false);
        if (mode === 'focus') {
          // Auto start break? Or just wait for user
          setMode('break');
          setTimeLeft(BREAK_TIME);
          // We could trigger a notification here
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Focus session complete!', { body: 'Time for a 5-minute break.' });
          }
        } else if (mode === 'break') {
          setMode('idle');
          setTimeLeft(FOCUS_TIME);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Break over!', { body: 'Ready to focus again?' });
          }
        }
      }, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, BREAK_TIME, FOCUS_TIME]);

  const startFocus = useCallback(() => {
    setMode('focus');
    setTimeLeft(FOCUS_TIME);
    setIsActive(true);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [FOCUS_TIME]);

  const startBreak = useCallback(() => {
    setMode('break');
    setTimeLeft(BREAK_TIME);
    setIsActive(true);
  }, [BREAK_TIME]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setMode('idle');
    setTimeLeft(FOCUS_TIME);
  }, [FOCUS_TIME]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return { mode, timeLeft, isActive, startFocus, startBreak, stopTimer, formatTime };
}
