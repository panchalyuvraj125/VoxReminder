import { formatTime } from '../../utils/parseReminder';
import type { Reminder } from '../../hooks/useReminders';
import { X, Clock, Timer, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/parseReminder';

interface RemindersTableProps {
  reminders: Reminder[];
  onCancel?: (id: string) => void;
  showStatus?: boolean;
}

function CountdownTimer({ targetTimestamp }: { targetTimestamp: number }) {
  const [countdown, setCountdown] = useState(formatCountdown(targetTimestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(targetTimestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return (
    <span className="font-mono text-primary-400">{countdown}</span>
  );
}

export default function RemindersTable({ reminders, onCancel, showStatus = false }: RemindersTableProps) {
  if (reminders.length === 0) {
    return (
      <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/5 p-8 text-center border border-dashed border-white/10">
        <p className="text-sm text-white/40">No reminders to show.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
      <div className="grid grid-cols-[1fr_100px_80px_80px] sm:grid-cols-[1fr_140px_100px_100px_40px] text-[10px] text-white/35 uppercase tracking-wider px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <span>Reminder Task</span>
        <span>Scheduled Time</span>
        <span className="hidden sm:block">Priority</span>
        <span>Status</span>
        {onCancel && <span className="text-center">Action</span>}
      </div>
      <div className="divide-y divide-white/5">
        {reminders.map((r) => {
          const isActive = r.status === 'active';
          const isTriggered = r.status === 'triggered';
          
          let statusText = 'Active';
          let statusColor = 'text-[#febc2e]/90';
          if (isTriggered) {
            statusText = 'Triggered';
            statusColor = 'text-[#28c840]/90';
          } else if (r.status === 'dismissed') {
            statusText = 'Dismissed';
            statusColor = 'text-white/40';
          }

          const priorityColors = {
            low: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
            normal: 'text-blue-400 bg-blue-400/10 ring-blue-400/20',
            high: 'text-orange-400 bg-orange-400/10 ring-orange-400/20',
            urgent: 'text-red-400 bg-red-400/10 ring-red-400/20',
          };
          const priorityLabels = {
            low: 'Low',
            normal: 'Normal',
            high: 'High',
            urgent: 'Urgent',
          };
          
          const pColor = priorityColors[r.priority] || priorityColors.normal;
          const pLabel = priorityLabels[r.priority] || 'Normal';

          return (
            <div key={r.id} className="grid grid-cols-[1fr_100px_80px_80px] sm:grid-cols-[1fr_140px_100px_100px_40px] items-center text-xs px-4 py-3 hover:bg-white/[0.04] transition-colors group">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-white/80 font-medium truncate group-hover:text-white transition-colors flex items-center gap-1.5">
                  {r.repeatIntervalMs && <span title="Recurring reminder"><Repeat className="w-3 h-3 text-primary-400 shrink-0" /></span>}
                  {r.parsedTask}
                </span>
                <span className="text-[10px] text-white/30 truncate hidden sm:block mt-0.5">"{r.originalText}"</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white/50 flex items-center gap-1.5"><Clock className="w-3 h-3 text-white/30" /> {formatTime(r.targetTimestamp)}</span>
                {isActive && <span className="text-[10px] flex items-center gap-1"><Timer className="w-2.5 h-2.5 text-primary-400" /><CountdownTimer targetTimestamp={r.targetTimestamp} /></span>}
              </div>
              <div className="hidden sm:flex items-center">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${pColor} font-medium tracking-wide`}>
                  {pLabel}
                </span>
              </div>
              <span className={`${statusColor} font-medium`}>{showStatus ? statusText : statusText}</span>
              {onCancel && (
                <div className="flex justify-center">
                  <button
                    onClick={() => onCancel(r.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 sm:opacity-100 group-hover:opacity-100"
                    title="Cancel reminder"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
