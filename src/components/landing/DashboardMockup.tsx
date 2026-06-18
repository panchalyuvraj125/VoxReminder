import { useRef, useEffect, useState, type ReactNode } from 'react';
import {
  PanelLeft, ChevronLeft, ChevronRight, Monitor, RotateCw, Share, Plus, Copy,
  Compass, Layers, ListTodo, Sparkles, Grid2X2,
} from 'lucide-react';
import Logo from './Logo';

/* ── ScaledDashboard: renders at fixed width, scales to fit ── */
function ScaledDashboard({ designWidth = 896, children }: { designWidth?: number; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const [innerHeight, setInnerHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const ro = new ResizeObserver(() => {
      const s = outer.offsetWidth / designWidth;
      setScale(s);
      setInnerHeight(inner.offsetHeight * s);
    });
    ro.observe(outer);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={outerRef} className="w-full overflow-hidden">
      <div
        style={{
          width: designWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          height: innerHeight,
        }}
      >
        <div ref={innerRef}>{children}</div>
      </div>
    </div>
  );
}

/* ── Traffic lights ── */
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
    </div>
  );
}

/* ── Sidebar nav item ── */
function SideItem({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] ${active ? 'bg-white/[0.06] text-white/80' : 'text-white/60 hover:text-white/70'}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

/* ── Stat card ── */
function Stat({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <div className="text-xl font-medium text-white">{value}</div>
      <div className="text-[9px] tracking-wider text-white/35 uppercase mt-0.5">{label}</div>
      <div className="text-[8px] text-white/25 mt-0.5">{sublabel}</div>
    </div>
  );
}

/* ── Subject card ── */
function SubjectCard({ emoji, name, count }: { emoji: string; name: string; count: number }) {
  return (
    <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 p-3">
      <div className="text-sm mb-1">{emoji}</div>
      <div className="text-[11px] font-medium text-white/80">{name}</div>
      <div className="text-[9px] text-white/35 mt-0.5">{count} reminders</div>
    </div>
  );
}

/* ── Main mockup ── */
export default function DashboardMockup() {
  const articles = [
    { q: 'Remind me to drink water', vol: '5:00 PM', diff: 'Easy', status: 'Active' },
    { q: 'Call mom after lunch', vol: '1:30 PM', diff: 'Easy', status: 'Active' },
    { q: 'Take medicine before bed', vol: '10:00 PM', diff: 'Easy', status: 'Pending' },
    { q: 'Review project notes', vol: '3:00 PM', diff: 'Medium', status: 'Drafting' },
    { q: 'Walk the dog at sunset', vol: '6:45 PM', diff: 'Easy', status: 'Active' },
  ];

  return (
    <ScaledDashboard>
      <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left">
        {/* Title bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
          <TrafficLights />
          <div className="flex items-center gap-2 ml-2">
            <PanelLeft className="w-3.5 h-3.5 text-white/40" />
            <ChevronLeft className="w-3.5 h-3.5 text-white/25" />
            <ChevronRight className="w-3.5 h-3.5 text-white/25" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 flex items-center gap-1.5">
              <Monitor className="w-3 h-3" /> voxremind.app
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RotateCw className="w-3.5 h-3.5 text-white/40" />
            <Share className="w-3.5 h-3.5 text-white/40" />
            <Plus className="w-3.5 h-3.5 text-white/40" />
            <Copy className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>

        {/* Body */}
        <div className="flex" style={{ minHeight: 380 }}>
          {/* Sidebar */}
          <div className="border-r border-white/5 bg-[#1e1e21] px-3 py-3.5" style={{ width: '22%' }}>
            <div className="flex items-center justify-between mb-4">
              <Logo className="w-4 h-4 text-white/70" />
              <Grid2X2 className="w-3.5 h-3.5 text-white/30" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded bg-primary-500 flex items-center justify-center text-[8px] font-bold text-white">V</div>
              <span className="text-[10px] text-white/80">VoxRemind</span>
            </div>

            <div className="space-y-0.5 mb-4">
              <SideItem icon={Compass} label="Dashboard" active />
              <SideItem icon={Layers} label="Categories" />
              <SideItem icon={ListTodo} label="Inbox" />
            </div>

            <div className="text-[8px] text-white/30 uppercase tracking-wider mb-2 px-2">Recent</div>
            {['Drink water', 'Call mom', 'Take medicine', 'Walk the dog'].map((a) => (
              <div key={a} className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full" style={{ color: '#28c840', opacity: 0.7 }}>●</span>
                {a}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-sm font-bold text-white">V</div>
                <div>
                  <div className="text-sm font-medium text-white">VoxRemind</div>
                  <div className="text-[10px] text-white/45">Voice-activated reminder dashboard</div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-primary-500/20 text-primary-300 text-[10px] px-3 py-1.5 rounded-md hover:bg-primary-/30 transition-colors">
                <Sparkles className="w-3 h-3" /> New Reminder
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5">
              <Stat value="3" label="Active" sublabel="Timers running" />
              <Stat value="12" label="Triggered" sublabel="Reminders fired" />
              <Stat value="2" label="Dismissed" sublabel="Skipped by user" />
              <Stat value="47" label="Total" sublabel="All-time reminders" />
            </div>

            {/* Subject cards */}
            <div className="grid grid-cols-3 gap-3">
              <SubjectCard emoji="💧" name="Health" count={18} />
              <SubjectCard emoji="📞" name="Personal" count={14} />
              <SubjectCard emoji="💼" name="Work/Study" count={15} />
            </div>

            {/* Table */}
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_70px_80px] text-[8px] text-white/35 uppercase tracking-wider px-3 py-2 border-b border-white/5">
                <span>Reminder</span>
                <span>Time</span>
                <span>Priority</span>
                <span>Status</span>
              </div>
              {articles.map((a) => (
                <div key={a.q} className="grid grid-cols-[1fr_80px_70px_80px] text-[10px] px-3 py-2 border-b border-white/5 last:border-b-0">
                  <span className="text-white/70 truncate">{a.q}</span>
                  <span className="text-white/40">{a.vol}</span>
                  <span className="text-white/40">{a.diff}</span>
                  <span className={a.status === 'Drafting' ? 'text-[#febc2e]/80' : a.status === 'Active' ? 'text-[#28c840]/80' : 'text-white/40'}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScaledDashboard>
  );
}
