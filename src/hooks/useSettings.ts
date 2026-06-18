import { useState, useEffect } from 'react';

export interface AppSettings {
  profileName: string;
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
}

const DEFAULT_SETTINGS: AppSettings = {
  profileName: 'Personal',
  focusDuration: 25,
  breakDuration: 5,
};

const SETTINGS_KEY = 'voxremind_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return {
    settings,
    updateSettings,
  };
}
