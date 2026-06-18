import { useState, useEffect, useCallback, useRef } from 'react';

export interface Reminder {
  id: string;
  originalText: string;
  parsedTask: string;
  targetTimestamp: number;
  createdAt: number;
  isCompleted: boolean;
  status: 'active' | 'triggered' | 'dismissed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  repeatIntervalMs?: number;
}

const STORAGE_KEY = 'voxremind_reminders';

function loadReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReminders(reminders: Reminder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch {
    // localStorage unavailable — silent fail
  }
}

export function useReminders(isFocused: boolean = false) {
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);
  const [triggeredReminder, setTriggeredReminder] = useState<Reminder | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Check localStorage availability
  useEffect(() => {
    try {
      localStorage.setItem('__voxremind_test', '1');
      localStorage.removeItem('__voxremind_test');
    } catch {
      setTimeout(() => setStorageAvailable(false), 0);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (storageAvailable) saveReminders(reminders);
  }, [reminders, storageAvailable]);

  // ── Timer Engine: check every second ──
  const remindersRef = useRef(reminders);
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const current = remindersRef.current;
      let changed = false;
      let fired: Reminder | null = null;

      const updated = current.map((r) => {
        if (r.status === 'active' && now >= r.targetTimestamp) {
          // Delay non-urgent reminders during focus mode
          if (isFocused && r.priority !== 'urgent') {
            return [r];
          }

          changed = true;
          
          if (r.repeatIntervalMs && r.repeatIntervalMs > 0) {
            // It's recurring! Schedule the next occurrence
            const nextTimestamp = r.targetTimestamp + r.repeatIntervalMs;
            
            // Mark current as triggered, but duplicate it for history
            // Wait, standard practice for recurring is to just update targetTimestamp and keep it active,
            // but we want to trigger the alert NOW. So we set triggered, but we also create a new active one!
            const newActive: Reminder = {
              ...r,
              id: crypto.randomUUID(),
              targetTimestamp: nextTimestamp,
              createdAt: now,
            };
            
            // We'll push newActive later, but we mark this one as triggered
            const triggered = { ...r, status: 'triggered' as const, isCompleted: true, repeatIntervalMs: undefined };
            if (!fired) fired = triggered;
            
            // We return an array and flatMap later, or just push to a new array
            // Since we can't map to 2 items easily, let's just handle it
            return [triggered, newActive];
          }

          const triggered = { ...r, status: 'triggered' as const, isCompleted: true };
          if (!fired) fired = triggered;
          return [triggered];
        }
        return [r];
      }).flat();

      if (changed) {
        setReminders(updated);
        if (fired) setTriggeredReminder(fired);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocused]);

  const addReminder = useCallback((originalText: string, parsedTask: string, targetTimestamp: number, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal', repeatIntervalMs?: number) => {
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      originalText,
      parsedTask,
      targetTimestamp,
      createdAt: Date.now(),
      isCompleted: false,
      status: 'active',
      priority,
      repeatIntervalMs,
    };
    setReminders((prev) => [reminder, ...prev]);
    return reminder;
  }, []);

  const cancelReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const dismissReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'dismissed' as const } : r))
    );
    setTriggeredReminder(null);
  }, []);

  const rescheduleReminder = useCallback((originalId: string, newTargetTimestamp: number) => {
    setReminders((prev) => {
      const original = prev.find(r => r.id === originalId);
      if (!original) return prev;

      // Mark the original as rescheduled (we'll treat it as dismissed in the history so it doesn't clutter active queue)
      const updatedPrev = prev.map((r) => (r.id === originalId ? { ...r, status: 'dismissed' as const } : r));
      
      // Spawn a fresh active reminder for the newly scheduled time
      const newReminder: Reminder = {
        ...original,
        id: crypto.randomUUID(),
        targetTimestamp: newTargetTimestamp,
        status: 'active',
        isCompleted: false,
        createdAt: Date.now()
      };
      
      return [newReminder, ...updatedPrev];
    });
    setTriggeredReminder(null); // Hide the overlay
  }, []);

  const dismissOverlay = useCallback(() => {
    setTriggeredReminder(null);
  }, []);

  const clearHistory = useCallback(() => {
    setReminders((prev) => prev.filter((r) => r.status === 'active'));
  }, []);

  const importReminders = useCallback((imported: Reminder[]) => {
    setReminders(imported);
  }, []);

  const activeReminders = reminders.filter((r) => r.status === 'active');
  const historyReminders = reminders.filter((r) => r.status !== 'active');

  return {
    reminders,
    activeReminders,
    historyReminders,
    triggeredReminder,
    storageAvailable,
    addReminder,
    cancelReminder,
    dismissReminder,
    rescheduleReminder,
    dismissOverlay,
    clearHistory,
    importReminders,
  };
}
