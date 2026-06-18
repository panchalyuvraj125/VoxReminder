import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { parseReminder, formatTime } from '../../utils/parseReminder';
import { useToast } from './Toast';

interface ControlPanelProps {
  onSchedule: (originalText: string, parsedTask: string, targetTimestamp: number, priority?: 'low' | 'normal' | 'high' | 'urgent', repeatIntervalMs?: number) => void;
}

export default function ControlPanel({ onSchedule }: ControlPanelProps) {
  const [input, setInput] = useState('');
  const [parseFeedback, setParseFeedback] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const debounceRef = useRef<number>(0);
  const { showToast } = useToast();

  // ── Live parse feedback (debounced) ──
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    if (!input.trim()) {
      return;
    }
    debounceRef.current = window.setTimeout(() => {
      const result = parseReminder(input);
      if (result) {
        setParseFeedback(`✅ Task → ${result.parsedTask} | Time → ${formatTime(result.targetTimestamp)}`);
      } else {
        setParseFeedback('⚠️ Could not parse time. Try "in 5 minutes", "at 3:00 PM", etc.');
      }
    }, 400);
    return () => window.clearTimeout(debounceRef.current);
  }, [input]);

  // ── Handle scheduling ──
  const handleSchedule = useCallback(async () => {
    const text = input.trim();
    if (!text) {
      showToast('Please type or speak a reminder first.', 'warning');
      return;
    }
    
    setIsScheduling(true);
    try {
      const result = parseReminder(text);
      if (!result) throw new Error('parse_failed');
      
      onSchedule(text, result.parsedTask, result.targetTimestamp, 'normal', result.repeatIntervalMs);
      showToast(`Reminder set: ${result.parsedTask} at ${formatTime(result.targetTimestamp)}`, 'success');
      setInput('');
      setParseFeedback(null);
    } catch {
      showToast('Could not understand the time. Try "in 5 minutes" or "at 3:00 PM".', 'error');
    } finally {
      setIsScheduling(false);
    }
  }, [input, onSchedule, showToast]);

  // ── Removed Speech Recognition ──
  // The user requested the microphone to be removed due to browser incompatibilities.

  return (
    <div className="bg-[#1a1a1c] ring-1 ring-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white/90 flex items-center gap-2">
            VoxRemind 
          </h1>
          <p className="text-xs text-white/50">Speak or type to schedule reminders</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          id="reminder-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSchedule();
            }
          }}
          placeholder='Try: "Remind me to drink water at 5:00 PM" or "In 10 seconds remind me to breathe"'
          className="w-full bg-[#242427] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all min-h-[80px]"
          rows={3}
        />
      </div>



      {/* Schedule Button */}
      <button
        id="schedule-button"
        onClick={handleSchedule}
        disabled={isScheduling}
        className="w-full py-3 rounded-full font-medium text-sm text-white bg-primary-600 hover:bg-primary-500 hover:shadow-lg active:scale-[0.98] transition-all shadow-primary-500/25 disabled:opacity-50 disabled:cursor-wait"
      >
        {isScheduling ? 'Scheduling...' : 'Schedule Reminder'}
      </button>

      {/* Parse Feedback */}
      {parseFeedback && (
        <div className={`text-xs px-3 py-2 rounded-lg ${parseFeedback.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'}`}>
          {parseFeedback}
        </div>
      )}
    </div>
  );
}
