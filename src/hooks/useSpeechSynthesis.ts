import { useEffect, useState, useCallback } from 'react';
import type { Reminder } from './useReminders';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setTimeout(() => setIsSupported(false), 0);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakReminder = useCallback((reminder: Reminder): boolean => {
    if (!window.speechSynthesis) return false;

    const now = new Date(reminder.targetTimestamp);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message = `Attention! It is now ${timeStr}. You scheduled a reminder: ${reminder.parsedTask}. Start this task immediately.`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferred) utterance.voice = preferred;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { isSupported, voicesLoaded, speakReminder };
}
