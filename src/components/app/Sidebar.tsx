import { Link } from 'react-router-dom';
import { Compass, Layers, ListTodo, Grid2X2, Activity, Settings as SettingsIcon, Calendar } from 'lucide-react';
import Logo from '../landing/Logo';
import type { Reminder } from '../../hooks/useReminders';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  recentReminders?: Reminder[];
  profileName?: string;
}

function SideItem({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-white/10 text-white/90 font-medium' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar({ currentView, onViewChange, recentReminders = [], profileName = 'Personal' }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col w-64 border-r border-white/5 bg-[#1e1e21] px-4 py-5 h-full shrink-0">
      <div className="flex items-center justify-between mb-8 px-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="w-5 h-5 text-white/80" />
          <span className="text-white/90 text-sm font-bold tracking-tight">VoxRemind</span>
        </Link>
        <Grid2X2 className="w-4 h-4 text-white/30" />
      </div>

      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/20">
          {profileName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-white/90 font-medium">{profileName}'s</span>
          <span className="text-[11px] text-white/40">Workspace</span>
        </div>
      </div>

      <div className="space-y-1 mb-8">
        <SideItem icon={Compass} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
        <SideItem icon={Calendar} label="Timeline" active={currentView === 'timeline'} onClick={() => onViewChange('timeline')} />
        <SideItem icon={Activity} label="Analytics" active={currentView === 'analytics'} onClick={() => onViewChange('analytics')} />
        <SideItem icon={Layers} label="Categories" active={currentView === 'categories'} onClick={() => onViewChange('categories')} />
        <SideItem icon={ListTodo} label="Inbox" active={currentView === 'inbox'} onClick={() => onViewChange('inbox')} />
        <SideItem icon={SettingsIcon} label="Settings" active={currentView === 'settings'} onClick={() => onViewChange('settings')} />
      </div>

      <div className="mt-auto">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3 px-3 font-semibold">Recent Reminders</div>
        <div className="space-y-1 overflow-y-auto max-h-[35vh] custom-scrollbar px-1">
          {recentReminders.length === 0 ? (
            <div className="text-[11px] text-white/30 px-2 py-2">No recent reminders</div>
          ) : (
            recentReminders.slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center gap-2.5 px-2 py-2 text-[11px] text-white/50 hover:bg-white/5 rounded-md transition-colors group">
                <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: r.status === 'triggered' ? '#28c840' : r.status === 'active' ? '#febc2e' : '#ff5f57', opacity: 0.8 }}></span>
                <span className="truncate group-hover:text-white/80 transition-colors">{r.parsedTask}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3 px-3 font-semibold">Theme</div>
        <div className="flex items-center gap-2 px-3">
          <button onClick={() => setTheme('violet')} className={`w-6 h-6 rounded-full bg-[#8b5cf6] ring-2 ring-offset-2 ring-offset-[#1e1e21] transition-all ${theme === 'violet' ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'}`} title="Violet" />
          <button onClick={() => setTheme('neon')} className={`w-6 h-6 rounded-full bg-[#22c55e] ring-2 ring-offset-2 ring-offset-[#1e1e21] transition-all ${theme === 'neon' ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'}`} title="Neon Green" />
          <button onClick={() => setTheme('crimson')} className={`w-6 h-6 rounded-full bg-[#ef4444] ring-2 ring-offset-2 ring-offset-[#1e1e21] transition-all ${theme === 'crimson' ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'}`} title="Crimson" />
          <button onClick={() => setTheme('ocean')} className={`w-6 h-6 rounded-full bg-[#0ea5e9] ring-2 ring-offset-2 ring-offset-[#1e1e21] transition-all ${theme === 'ocean' ? 'ring-white' : 'ring-transparent opacity-50 hover:opacity-100'}`} title="Ocean Blue" />
        </div>
      </div>

    </div>
  );
}
