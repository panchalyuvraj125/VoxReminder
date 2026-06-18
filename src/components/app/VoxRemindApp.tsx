import { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import TimelineView from './TimelineView';
import CategoriesView from './CategoriesView';
import InboxView from './InboxView';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsView from './SettingsView';
import ZenMode from './ZenMode';
import ReminderOverlay from './ReminderOverlay';
import { useReminders } from '../../hooks/useReminders';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useNotifications } from '../../hooks/useNotifications';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useSettings } from '../../hooks/useSettings';

export default function VoxRemindApp() {
  const { settings } = useSettings();
  const pomodoro = usePomodoro(settings.focusDuration, settings.breakDuration);
  const [isZenMode, setIsZenMode] = useState(false);

  const {
    activeReminders,
    historyReminders,
    triggeredReminder,
    storageAvailable,
    addReminder,
    cancelReminder,
    rescheduleReminder,
    dismissOverlay,
    clearHistory,
  } = useReminders(pomodoro.mode === 'focus');

  const { speakReminder } = useSpeechSynthesis();
  const { requestPermission, sendNotification } = useNotifications();

  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show warning if localStorage is unavailable
  if (!storageAvailable && typeof window !== 'undefined') {
    // Just suppressing infinite loops, toast could be fired once via useEffect if needed
  }

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Trigger browser notification when a reminder fires
  useEffect(() => {
    if (triggeredReminder) {
      sendNotification('VoxRemind', triggeredReminder.parsedTask);
    }
  }, [triggeredReminder, sendNotification]);

  const handleSchedule = useCallback(
    (originalText: string, parsedTask: string, targetTimestamp: number, priority?: 'low' | 'normal' | 'high' | 'urgent', repeatIntervalMs?: number) => {
      addReminder(originalText, parsedTask, targetTimestamp, priority, repeatIntervalMs);
    },
    [addReminder]
  );

  const allReminders = useMemo(() => {
    return [...activeReminders, ...historyReminders].sort((a, b) => b.targetTimestamp - a.targetTimestamp);
  }, [activeReminders, historyReminders]);

  return (
    <div className={`flex h-[100svh] bg-[#121214] overflow-hidden text-white transition-opacity duration-1000 ${pomodoro.mode === 'focus' ? 'opacity-90 saturate-50' : 'opacity-100'}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          currentView={currentView} 
          onViewChange={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} 
          recentReminders={allReminders}
          profileName={settings.profileName}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#1a1a1c] relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#1a1a1c]">
          <span className="font-semibold text-white/90">VoxRemind</span>
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* View Rendering */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {currentView === 'dashboard' && (
             <DashboardView 
               activeReminders={activeReminders} 
               historyReminders={historyReminders} 
               onSchedule={handleSchedule} 
               onCancel={cancelReminder}
               pomodoro={pomodoro}
               onEnterZenMode={() => setIsZenMode(true)}
             />
          )}
          {currentView === 'timeline' && (
            <TimelineView 
              activeReminders={activeReminders}
              onComplete={cancelReminder}
            />
          )}
          {currentView === 'categories' && (
             <CategoriesView 
               allReminders={allReminders}
             />
          )}
          {currentView === 'analytics' && (
             <AnalyticsDashboard 
               historyReminders={historyReminders}
             />
          )}
          {currentView === 'inbox' && (
             <InboxView 
               activeReminders={activeReminders} 
               historyReminders={historyReminders}
               onCancel={cancelReminder}
               onClear={clearHistory}
             />
          )}
          {currentView === 'settings' && (
             <SettingsView />
          )}
        </div>
      </div>

      {/* Triggered Reminder Overlay */}
      {triggeredReminder && (
        <ReminderOverlay
          reminder={triggeredReminder}
          activeReminders={activeReminders}
          onDismiss={dismissOverlay}
          onSpeak={speakReminder}
          onReschedule={rescheduleReminder}
        />
      )}

      {/* Deep Work Zen Mode */}
      {isZenMode && (
        <ZenMode 
          pomodoro={pomodoro} 
          onExit={() => setIsZenMode(false)} 
        />
      )}
    </div>
  );
}
