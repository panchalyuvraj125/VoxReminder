import { useEffect, useState } from 'react';
import { Clock, X, Timer, Repeat } from 'lucide-react';
import type { Reminder } from '../../hooks/useReminders';
import { formatCountdown, formatTime } from '../../utils/parseReminder';

interface LiveQueueProps {
  reminders: Reminder[];
  onCancel: (id: string) => void;
}

function ReminderCard({ reminder, onCancel }: { reminder: Reminder; onCancel: (id: string) => void }) {
  const [countdown, setCountdown] = useState(formatCountdown(reminder.targetTimestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(reminder.targetTimestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [reminder.targetTimestamp]);

  const scheduledTime = new Date(reminder.targetTimestamp);
  const isToday = new Date().toDateString() === scheduledTime.toDateString();
  const dateLabel = isToday ? 'Today' : 'Tomorrow';

  return (
    <div className="relative bg-[#242427] ring-1 ring-white/10 rounded-xl p-4 border-l-4 border-l-primary-500 hover:bg-[#2a2a2e] transition-colors group">
      {/* Cancel button */}
      <button
        onClick={() => onCancel(reminder.id)}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
        title="Cancel reminder"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Task name */}
      <h3 className="text-sm font-medium text-white/90 pr-8 flex items-center gap-2">
        {reminder.repeatIntervalMs ? <span title="Recurring Reminder"><Repeat className="w-3.5 h-3.5 text-primary-400" /></span> : null}
        {reminder.parsedTask}
      </h3>

      {/* Original text */}
      <p className="text-xs text-white/40 mt-1 truncate">"{reminder.originalText}"</p>

      {/* Meta */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-xs text-primary-400 font-medium">
          <Timer className="w-3.5 h-3.5" />
          <span className="font-mono">{countdown}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Clock className="w-3.5 h-3.5" />
          <span>{dateLabel} at {formatTime(reminder.targetTimestamp)}</span>
        </div>
      </div>
    </div>
  );
}

export default function LiveQueue({ reminders, onCancel }: LiveQueueProps) {
  return (
    <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
        <span className="text-lg">⏳</span> Active Reminders
        <span className="ml-auto bg-primary-500/20 text-primary-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {reminders.length}
        </span>
      </h2>

      {reminders.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="text-4xl">🔔</div>
          <p className="text-sm text-white/50">No reminders yet.</p>
          <p className="text-xs text-white/40">Speak or type one above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}
