import { useMemo } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import type { Reminder } from '../../hooks/useReminders';
import { formatTime } from '../../utils/parseReminder';

interface TimelineViewProps {
  activeReminders: Reminder[];
  onComplete: (id: string) => void;
}

export default function TimelineView({ activeReminders, onComplete }: TimelineViewProps) {
  // Group reminders by hour of the day
  const groupedReminders = useMemo(() => {
    const groups: Record<number, Reminder[]> = {};
    activeReminders.forEach(r => {
      const d = new Date(r.targetTimestamp);
      const h = d.getHours();
      if (!groups[h]) groups[h] = [];
      groups[h].push(r);
    });
    // Sort each group by exact time
    Object.values(groups).forEach(group => {
      group.sort((a, b) => a.targetTimestamp - b.targetTimestamp);
    });
    return groups;
  }, [activeReminders]);

  const currentHour = new Date().getHours();
  // Display timeline from 8 AM to 10 PM (8 to 22), plus any hours outside that have tasks
  const minHour = Math.min(8, ...Object.keys(groupedReminders).map(Number));
  const maxHour = Math.max(22, ...Object.keys(groupedReminders).map(Number));

  const hours = [];
  for (let i = minHour; i <= maxHour; i++) {
    hours.push(i);
  }

  const formatHourLabel = (h: number) => {
    const d = new Date();
    d.setHours(h, 0, 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up pb-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white/90">Day Architect</h2>
          <p className="text-xs text-white/50">Your time-blocked visual schedule</p>
        </div>
      </div>

      <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[88px] top-8 bottom-8 w-px bg-white/10" />

        <div className="space-y-6 relative z-10">
          {hours.map(hour => {
            const isCurrentHour = hour === currentHour;
            const isPast = hour < currentHour;
            const tasks = groupedReminders[hour] || [];

            return (
              <div key={hour} className={`flex gap-6 transition-opacity duration-300 ${isPast && tasks.length === 0 ? 'opacity-30' : 'opacity-100'}`}>
                {/* Time Label */}
                <div className="w-16 shrink-0 text-right pt-2">
                  <span className={`text-xs font-semibold tracking-wider ${isCurrentHour ? 'text-primary-400' : 'text-white/40'}`}>
                    {formatHourLabel(hour)}
                  </span>
                </div>

                {/* Timeline Node */}
                <div className="relative flex flex-col items-center shrink-0">
                  <div className={`w-3 h-3 rounded-full ring-4 ring-[#1a1a1c] mt-2.5 transition-colors ${
                    isCurrentHour ? 'bg-primary-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 
                    tasks.length > 0 ? 'bg-white/60' : 'bg-white/20'
                  }`} />
                </div>

                {/* Content Block */}
                <div className="flex-1 min-h-[4rem] pb-4">
                  {tasks.length > 0 ? (
                    <div className="space-y-3 pt-1.5">
                      {tasks.map(task => (
                        <div key={task.id} className="group relative bg-[#242427] hover:bg-[#2a2a2e] ring-1 ring-white/10 hover:ring-primary-500/50 rounded-2xl p-4 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-semibold text-white/90">{task.parsedTask}</h3>
                              <p className="text-xs text-white/40 mt-1">"{task.originalText}"</p>
                              <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full w-fit">
                                <Clock className="w-3 h-3" />
                                {formatTime(task.targetTimestamp)}
                              </div>
                            </div>
                            <button
                              onClick={() => onComplete(task.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-emerald-500 text-white/30 hover:text-white transition-all shrink-0"
                              title="Mark complete"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`pt-1.5 h-full flex items-center text-[11px] font-medium ${isCurrentHour ? 'text-primary-500/50' : 'text-white/20'}`}>
                      -- Free Block --
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
