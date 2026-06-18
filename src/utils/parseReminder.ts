export interface ParsedReminder {
  parsedTask: string;
  targetTimestamp: number;
  repeatIntervalMs?: number;
}

/**
 * Lightweight NLP parser using regex to extract task + time from natural language.
 * Handles absolute times, relative times, recurring patterns, and supports basic Hindi.
 */
export function parseReminder(text: string): ParsedReminder | null {
  const input = text.trim().toLowerCase();
  if (!input) return null;

  let targetTimestamp: number | null = null;
  let repeatIntervalMs: number | undefined = undefined;
  let taskPart = input;

  // ── Recurring (English): "every X minutes/hours/days"
  const repeatEngRegex = /\bevery\s+(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?|days?)\b/i;
  // ── Recurring (Hindi): "har X minute/ghante/din"
  const repeatHinRegex = /\bhar\s+(\d+)\s*(second|minute|ghante|din|ghanta)\b/i;

  let repMatch = input.match(repeatEngRegex);
  if (repMatch) {
    const amount = parseInt(repMatch[1], 10);
    const unit = repMatch[2].toLowerCase();
    if (unit.startsWith('sec')) repeatIntervalMs = amount * 1000;
    else if (unit.startsWith('min')) repeatIntervalMs = amount * 60 * 1000;
    else if (unit.startsWith('hr') || unit.startsWith('hour')) repeatIntervalMs = amount * 3600 * 1000;
    else if (unit.startsWith('day')) repeatIntervalMs = amount * 86400 * 1000;
    
    targetTimestamp = Date.now() + (repeatIntervalMs || 0);
    taskPart = input.replace(repeatEngRegex, '').trim();
  }

  repMatch = input.match(repeatHinRegex);
  if (repMatch && !repeatIntervalMs) {
    const amount = parseInt(repMatch[1], 10);
    const unit = repMatch[2].toLowerCase();
    if (unit === 'second') repeatIntervalMs = amount * 1000;
    else if (unit === 'minute') repeatIntervalMs = amount * 60 * 1000;
    else if (unit === 'ghante' || unit === 'ghanta') repeatIntervalMs = amount * 3600 * 1000;
    else if (unit === 'din') repeatIntervalMs = amount * 86400 * 1000;

    targetTimestamp = Date.now() + (repeatIntervalMs || 0);
    taskPart = input.replace(repeatHinRegex, '').trim();
  }

  // ── Absolute time — "at HH:MM AM/PM" or "HH:MM baje" ──
  const absRegex = /\b(?:at\s+)?(\d{1,2}):(\d{2})\s*(am|pm|baje)\b/i;
  const absMatch = input.match(absRegex);

  if (absMatch && targetTimestamp === null) {
    let hours = parseInt(absMatch[1], 10);
    const minutes = parseInt(absMatch[2], 10);
    const period = absMatch[3].toLowerCase();

    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    // 'baje' assumes 24 hour if < 12 and it already passed, but we just check if passed below.
    
    const now = new Date();
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    targetTimestamp = target.getTime();
    taskPart = input.replace(absRegex, '').trim();
  }

  // ── Relative time (English) — "in/after X seconds/minutes/hours" ──
  if (targetTimestamp === null) {
    const relRegex = /\b(?:in|after)\s+(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\b/i;
    const relMatch = input.match(relRegex);

    if (relMatch) {
      const amount = parseInt(relMatch[1], 10);
      const unit = relMatch[2].toLowerCase();

      let ms = 0;
      if (unit.startsWith('sec')) ms = amount * 1000;
      else if (unit.startsWith('min')) ms = amount * 60 * 1000;
      else if (unit.startsWith('hr') || unit.startsWith('hour')) ms = amount * 3600 * 1000;

      targetTimestamp = Date.now() + ms;
      taskPart = input.replace(relRegex, '').trim();
    }
  }

  // ── Relative time (Hindi) — "5 minute mein", "1 ghante mein/baad" ──
  if (targetTimestamp === null) {
    const hinRelRegex = /\b(\d+)\s*(second|minute|ghante|ghanta)\s*(mein|baad)\b/i;
    const hinRelMatch = input.match(hinRelRegex);

    if (hinRelMatch) {
      const amount = parseInt(hinRelMatch[1], 10);
      const unit = hinRelMatch[2].toLowerCase();

      let ms = 0;
      if (unit === 'second') ms = amount * 1000;
      else if (unit === 'minute') ms = amount * 60 * 1000;
      else if (unit === 'ghante' || unit === 'ghanta') ms = amount * 3600 * 1000;

      targetTimestamp = Date.now() + ms;
      taskPart = input.replace(hinRelRegex, '').trim();
    }
  }

  if (targetTimestamp === null) return null;

  // ── Strip filler words to extract clean task ──
  const fillers = [
    /\bremind\s+me\s+to\b/gi,
    /\btell\s+me\s+to\b/gi,
    /\bremind\s+me\b/gi,
    /\btell\s+me\b/gi,
    /\bremember\s+to\b/gi,
    /\bdon'?t\s+forget\s+to\b/gi,
    /\bplease\b/gi,
    /\bthat\s+i\s+need\s+to\b/gi,
    /\bthat\s+i\s+should\b/gi,
    /\bi\s+need\s+to\b/gi,
    /\bi\s+should\b/gi,
    // Hindi fillers
    /\bki\s+yaad\s+dilaana\b/gi,
    /\bki\s+yaad\s+dilaayein\b/gi,
    /\byaad\s+dilaana\b/gi,
    /\bmujhe\b/gi,
    /\byaad\s+rakhna\b/gi,
    /\bkarna\s+hai\b/gi,
  ];

  for (const filler of fillers) {
    taskPart = taskPart.replace(filler, '');
  }

  // Clean up whitespace and leading/trailing noise
  taskPart = taskPart
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.\-—]+/, '')
    .replace(/[\s,.\-—]+$/, '')
    .trim();

  if (!taskPart) {
    taskPart = 'Unnamed reminder';
  }

  // Capitalize first letter
  taskPart = taskPart.charAt(0).toUpperCase() + taskPart.slice(1);

  return { parsedTask: taskPart, targetTimestamp, repeatIntervalMs };
}

/**
 * Format a timestamp to a readable time string.
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format the countdown from now to a target time.
 */
export function formatCountdown(targetTimestamp: number): string {
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) return 'Now!';

  const totalSec = Math.floor(diff / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
}
