import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, Target, CheckCircle2, XCircle } from 'lucide-react';
import type { Reminder } from '../../hooks/useReminders';

interface AnalyticsDashboardProps {
  historyReminders: Reminder[];
}

export default function AnalyticsDashboard({ historyReminders }: AnalyticsDashboardProps) {
  // Compute basic stats
  const total = historyReminders.length;
  const completed = historyReminders.filter(r => r.status === 'dismissed').length; // dismissed means acknowledged
  const missed = historyReminders.filter(r => r.status === 'triggered').length; // triggered but unacknowledged

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Chart Data: Last 7 days
  const last7DaysData = useMemo(() => {
    const days: Record<string, { name: string; completed: number; missed: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      days[d.toDateString()] = { name, completed: 0, missed: 0 };
    }

    historyReminders.forEach(r => {
      const d = new Date(r.targetTimestamp).toDateString();
      if (days[d]) {
        if (r.status === 'dismissed') days[d].completed++;
        else days[d].missed++;
      }
    });

    return Object.values(days);
  }, [historyReminders]);

  const pieData = [
    { name: 'Completed', value: completed, color: '#22c55e' },
    { name: 'Missed', value: missed, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white/90">Voice Analytics</h2>
          <p className="text-xs text-white/50">Your productivity trends over time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-primary-400"><Target className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-xs text-white/50">Completion Rate</div>
          </div>
        </div>
        <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-green-400"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{completed}</div>
            <div className="text-xs text-white/50">Tasks Completed</div>
          </div>
        </div>
        <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-red-400"><XCircle className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{missed}</div>
            <div className="text-xs text-white/50">Tasks Missed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl min-h-[300px]">
          <h3 className="text-sm font-semibold text-white/80 mb-6">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7DaysData}>
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#ffffff0a' }}
                contentStyle={{ backgroundColor: '#242427', border: '1px solid #ffffff1a', borderRadius: '12px' }}
              />
              <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missed" name="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-sm font-semibold text-white/80 mb-2 w-full text-left">Overall Ratio</h3>
          {total === 0 ? (
            <div className="text-sm text-white/30 m-auto">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#242427', border: '1px solid #ffffff1a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
