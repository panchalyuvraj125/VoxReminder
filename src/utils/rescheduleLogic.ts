import type { Reminder } from '../hooks/useReminders';

/**
 * Calculates a "Smart Slot" for rescheduling a reminder.
 * It looks for the next 15-minute block of time that does NOT conflict with any existing active reminders.
 * A conflict is defined as any reminder scheduled within a 5-minute buffer of the proposed time.
 */
export function getSmartRescheduleTime(activeReminders: Reminder[], baseTimestamp: number = Date.now()): number {
  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  const FIVE_MINUTES = 5 * 60 * 1000;

  let proposedTime = baseTimestamp + FIFTEEN_MINUTES;

  // Keep pushing forward by 15 mins until we find a slot that is clear of conflicts
  while (activeReminders.some(r => Math.abs(r.targetTimestamp - proposedTime) < FIVE_MINUTES)) {
    proposedTime += FIFTEEN_MINUTES;
  }

  return proposedTime;
}
