import ControlPanel from './ControlPanel';
import LiveQueue from './LiveQueue';
import FocusTimer from './FocusTimer';
import { categorizeTask } from '../../utils/categories';
import type { Reminder } from '../../hooks/useReminders';
import type { usePomodoro } from '../../hooks/usePomodoro';

interface DashboardViewProps {
  activeReminders: Reminder[];
  historyReminders: Reminder[];
  onSchedule: (originalText: string, parsedTask: string, targetTimestamp: number, priority?: 'low' | 'normal' | 'high' | 'urgent', repeatIntervalMs?: number) => void;
  onCancel: (id: string) => void;
  pomodoro: ReturnType<typeof usePomodoro>;
  onEnterZenMode?: () => void;
}

function Stat({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="text-2xl font-medium text-white/90">{value}</div>
      <div className="text-[10px] tracking-wider text-white/40 uppercase mt-1.5 font-semibold">{label}</div>
      <div className="text-[9px] text-white/30 mt-0.5">{sublabel}</div>
    </div>
  );
}

function SubjectCard({ emoji, name, count }: { emoji: string; name: string; count: number }) {
  return (
    <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/5 p-4 flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:bg-white/[0.04]">
      <div className="text-xl mb-2.5">{emoji}</div>
      <div className="text-xs font-medium text-white/80">{name}</div>
      <div className="text-[10px] text-white/40 mt-1">{count} reminders</div>
    </div>
  );
}

export default function DashboardView({ activeReminders, historyReminders, onSchedule, onCancel, pomodoro, onEnterZenMode }: DashboardViewProps) {
  const allReminders = [...activeReminders, ...historyReminders];
  const dismissedCount = historyReminders.filter(r => r.status === 'dismissed').length;
  const triggeredCount = historyReminders.filter(r => r.status === 'triggered').length;

  const categories = allReminders.reduce((acc, r) => {
    const cat = categorizeTask(r.parsedTask);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-primary-500/20">V</div>
          <div>
            <div className="text-base font-medium text-white/90">Dashboard Overview</div>
            <div className="text-xs text-white/50">Manage your voice-activated reminders</div>
          </div>
        </div>
      </div>

      {/* Control Panel / Voice Input */}
      <div className="lg:col-span-8 space-y-6">
        <ControlPanel 
          onSchedule={onSchedule} 
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 border border-white/5">
        <Stat value={activeReminders.length} label="Active" sublabel="Timers running" />
        <Stat value={triggeredCount} label="Triggered" sublabel="Reminders fired" />
        <Stat value={dismissedCount} label="Dismissed" sublabel="Skipped by user" />
        <Stat value={allReminders.length} label="Total" sublabel="All-time reminders" />
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <SubjectCard emoji="💧" name="Health" count={categories['Health'] || 0} />
        <SubjectCard emoji="📞" name="Personal" count={categories['Personal'] || 0} />
        <SubjectCard emoji="💼" name="Work/Study" count={categories['Work/Study'] || 0} />
        <SubjectCard emoji="📝" name="Other" count={categories['Other'] || 0} />
      </div>

      {/* Live Queue & Focus Timer */}
      <div className="lg:col-span-4 space-y-6">
        <FocusTimer pomodoro={pomodoro} onEnterZenMode={onEnterZenMode} />
        
        <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl h-[calc(100%-250px)] min-h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-primary"></span>
            Live Queue
          </h3>
          <LiveQueue 
            reminders={activeReminders} 
            onCancel={onCancel} 
          />
        </div>
      </div>
    </div>
  );
}
