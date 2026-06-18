import type { Reminder } from '../../hooks/useReminders';
import RemindersTable from './RemindersTable';
import { Trash2, AlertCircle, Search, Filter } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';

export default function InboxView({ 
  activeReminders, 
  historyReminders, 
  onCancel, 
  onClear 
}: { 
  activeReminders: Reminder[], 
  historyReminders: Reminder[], 
  onCancel: (id:string)=>void, 
  onClear:()=>void 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filterReminders = useCallback((reminders: Reminder[]) => {
    return reminders.filter(r => {
      const matchesSearch = r.parsedTask.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.originalText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [searchQuery, filterPriority]);

  const filteredActive = useMemo(() => filterReminders(activeReminders), [activeReminders, filterReminders]);
  const filteredHistory = useMemo(() => filterReminders(historyReminders), [historyReminders, filterReminders]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end">
        <div>
          <h2 className="text-xl font-medium text-white/90">Inbox</h2>
          <p className="text-sm text-white/50 mt-1">All your active and historical reminders in one place.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search reminders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none w-full sm:w-auto"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80">Active Queue</h3>
          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-medium">
            {filteredActive.length}
          </span>
        </div>
        <RemindersTable reminders={filteredActive} onCancel={onCancel} />
      </div>

      <div className="space-y-4 pt-4 mt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80">History</h3>
          {historyReminders.length > 0 && (
            <button 
              onClick={onClear} 
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/5 p-8 text-center border border-dashed border-white/10 flex flex-col items-center justify-center">
             <AlertCircle className="w-6 h-6 text-white/20 mb-2" />
             <p className="text-sm text-white/40">No historical reminders.</p>
          </div>
        ) : (
          <RemindersTable reminders={filteredHistory} showStatus />
        )}
      </div>
    </div>
  );
}
