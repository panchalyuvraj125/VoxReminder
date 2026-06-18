import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Clock } from 'lucide-react';
import type { Reminder } from '../../hooks/useReminders';
import { categorizeTask } from '../../utils/categories';
import { formatTime } from '../../utils/parseReminder';

interface HistoryProps {
  reminders: Reminder[];
  onClear: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    triggered: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    dismissed: 'bg-white/5 text-white/40 ring-1 ring-white/10',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[status as keyof typeof colors] || colors.dismissed}`}>
      {status}
    </span>
  );
}

function CategoryBadge({ task }: { task: string }) {
  const category = categorizeTask(task);
  return (
    <span className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full whitespace-nowrap ring-1 ring-white/10">
      {category}
    </span>
  );
}

export default function History({ reminders, onClear }: HistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Toggle Header */}
      <button
        id="history-toggle"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span className="text-lg">📋</span> Reminder History
          <span className="bg-white/10 text-white/60 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {reminders.length}
          </span>
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>

      {/* History List */}
      {open && (
        <div className="px-6 pb-4 space-y-2 border-t border-white/5 mt-2 pt-4">
          {reminders.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-6">No history yet.</p>
          ) : (
            <>
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#242427] hover:bg-[#2a2a2e] ring-1 ring-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white/80 truncate">{r.parsedTask}</span>
                      <CategoryBadge task={r.parsedTask} />
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-white/40">
                        <Clock className="w-3 h-3" />
                        Scheduled: {formatTime(r.targetTimestamp)}
                      </span>
                      <span className="text-[11px] text-white/30">
                        Completed: {new Date(r.targetTimestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear History */}
              <button
                id="clear-history-button"
                onClick={onClear}
                className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors mx-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear History
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
