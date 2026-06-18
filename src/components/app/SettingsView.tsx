import { useState, useRef } from 'react';
import { User, Timer, Save, Database, Download, Upload } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from './Toast';

export default function SettingsView() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [localSettings, setLocalSettings] = useState(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    showToast('Settings saved successfully!', 'success');
  };

  const handleExport = () => {
    try {
      const data = {
        settings: localSettings,
        reminders: JSON.parse(localStorage.getItem('voxremind_reminders') || '[]')
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voxremind-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to export data.', 'error');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.settings) {
          updateSettings(data.settings);
          setLocalSettings(data.settings);
        }
        if (data.reminders && Array.isArray(data.reminders)) {
          localStorage.setItem('voxremind_reminders', JSON.stringify(data.reminders));
          // We trigger a reload to let useReminders grab the fresh localStorage
          window.location.reload();
        } else {
          showToast('Data imported (Settings only).', 'success');
        }
      } catch (err) {
        console.error(err);
        showToast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white/90">Settings</h2>
          <p className="text-xs text-white/50">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-400" /> User Profile
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Your Name</label>
            <input
              type="text"
              value={localSettings.profileName}
              onChange={(e) => setLocalSettings({ ...localSettings, profileName: e.target.value })}
              className="w-full bg-[#242427] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              placeholder="e.g. Alex"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-2 flex items-center gap-2">
          <Timer className="w-4 h-4 text-green-400" /> Pomodoro Timer
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Focus Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={localSettings.focusDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, focusDuration: parseInt(e.target.value) || 25 })}
              className="w-full bg-[#242427] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Break Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.breakDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, breakDuration: parseInt(e.target.value) || 5 })}
              className="w-full bg-[#242427] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-semibold text-white/80 border-b border-white/10 pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" /> Data Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 w-full bg-[#242427] hover:bg-[#2a2a2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
          >
            <Download className="w-4 h-4 text-white/50" />
            Export Backup (.json)
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full bg-[#242427] hover:bg-[#2a2a2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
          >
            <Upload className="w-4 h-4 text-white/50" />
            Import Backup
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
          />
        </div>
        <p className="text-[10px] text-white/30 text-center">
          Importing a backup will overwrite your current settings and reminder history, and will reload the page.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors shadow-lg shadow-primary-500/25"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
