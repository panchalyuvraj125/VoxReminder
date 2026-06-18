import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Volume2, X, Clock, Sparkles } from 'lucide-react';
import type { Reminder } from '../../hooks/useReminders';
import { formatTime } from '../../utils/parseReminder';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { getSmartRescheduleTime } from '../../utils/rescheduleLogic';

interface ReminderOverlayProps {
  reminder: Reminder;
  activeReminders: Reminder[];
  onDismiss: () => void;
  onSpeak: (reminder: Reminder) => boolean;
  onReschedule: (originalId: string, newTimestamp: number) => void;
}

export default function ReminderOverlay({ reminder, activeReminders, onDismiss, onSpeak, onReschedule }: ReminderOverlayProps) {
  const timerRef = useRef<number>(0);
  const { playChime } = useNotificationSound();

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    timerRef.current = window.setTimeout(onDismiss, 30000);
    return () => window.clearTimeout(timerRef.current);
  }, [onDismiss]);

  // Try TTS on mount, after playing chime
  useEffect(() => {
    playChime();
    
    // Wait for the 0.8s chime to finish before speaking
    const t = setTimeout(() => {
      onSpeak(reminder);
    }, 800);
    
    return () => clearTimeout(t);
  }, [reminder, onSpeak, playChime]);

  const handleManualSpeak = useCallback(() => {
    onSpeak(reminder);
  }, [reminder, onSpeak]);

  const smartSlotTime = useMemo(() => getSmartRescheduleTime(activeReminders), [activeReminders]);

  const handleSnooze = (minutes: number) => {
    onReschedule(reminder.id, Date.now() + minutes * 60 * 1000);
  };

  const handleSmartReschedule = () => {
    onReschedule(reminder.id, smartSlotTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onDismiss} />

      {/* Card */}
      <div className="animate-overlay-in relative bg-[#1a1a1c]/90 backdrop-blur-xl ring-1 ring-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black animate-pulse-primary">
        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Bell icon */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔔</div>
          <div className="text-xs text-white/50 font-semibold uppercase tracking-wider">Reminder Triggered</div>
        </div>

        {/* Task */}
        <h2 className="text-2xl font-semibold text-white/90 text-center mb-2">{reminder.parsedTask}</h2>

        {/* Time */}
        <p className="text-sm text-white/50 text-center mb-6">
          Scheduled for {formatTime(reminder.targetTimestamp)}
        </p>

        <button
          onClick={handleManualSpeak}
          className="w-full mb-6 py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          Play Voice Reminder
        </button>

        {/* Reschedule Options */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => handleSnooze(15)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-white/5 text-white/80 hover:bg-white/10 transition-colors ring-1 ring-white/10"
          >
            <Clock className="w-3.5 h-3.5" /> +15m
          </button>
          <button
            onClick={() => handleSnooze(60)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-white/5 text-white/80 hover:bg-white/10 transition-colors ring-1 ring-white/10"
          >
            <Clock className="w-3.5 h-3.5" /> +1h
          </button>
        </div>

        <button
          onClick={handleSmartReschedule}
          className="w-full mb-3 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-primary-500/20 text-primary-300 ring-1 ring-primary-500/30 hover:bg-primary-500/30 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Smart Reschedule ({formatTime(smartSlotTime)})
        </button>

        {/* Dismiss */}
        <button
          id="dismiss-overlay-button"
          onClick={onDismiss}
          className="w-full py-3 rounded-xl text-sm font-medium bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
        >
          Dismiss Completely
        </button>

        {/* Auto-dismiss hint */}
        <p className="text-[10px] text-white/30 text-center mt-3">Auto-dismisses in 30 seconds</p>
      </div>
    </div>
  );
}
