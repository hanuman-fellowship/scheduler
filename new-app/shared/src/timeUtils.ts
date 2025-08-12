/**
 * Centralized time utilities for the scheduler application
 * All time handling logic should use these functions to ensure consistency
 */

// Time constants
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;

// Time period definitions (used throughout the app)
export const TIME_PERIODS = {
  MORNING: { name: 'Morning' as const, startSeconds: 0, endSeconds: 43200 },        // 00:00 - 12:00
  AFTERNOON: { name: 'Afternoon' as const, startSeconds: 43200, endSeconds: 61200 }, // 12:00 - 17:00
  EVENING: { name: 'Evening' as const, startSeconds: 61200, endSeconds: 86400 }      // 17:00 - 24:00
} as const;

export type TimePeriodName = 'Morning' | 'Afternoon' | 'Evening';

/**
 * Convert HH:MM or HH:MM:SS time string to seconds since midnight
 * @param timeString - Time in "HH:MM" or "HH:MM:SS" format
 * @returns Number of seconds since midnight (0-86399)
 */
export function timeStringToSeconds(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length < 2 || parts.length > 3) {
    throw new Error(`Invalid time format: ${timeString}. Expected HH:MM or HH:MM:SS`);
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts.length === 3 ? parseInt(parts[2], 10) : 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    throw new Error(`Invalid time values: ${timeString}`);
  }

  return (hours * SECONDS_PER_HOUR) + (minutes * SECONDS_PER_MINUTE) + seconds;
}

/**
 * Convert seconds since midnight to HH:MM:SS format
 * @param seconds - Seconds since midnight (0-86399)
 * @returns Time string in "HH:MM:SS" format
 */
export function secondsToTimeString(seconds: number): string {
  if (seconds < 0 || seconds >= SECONDS_PER_DAY) {
    throw new Error(`Invalid seconds: ${seconds}. Must be 0-86399`);
  }

  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const remainingSeconds = seconds % SECONDS_PER_HOUR;
  const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
  const secs = remainingSeconds % SECONDS_PER_MINUTE;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert seconds since midnight to HH:MM format (no seconds)
 * @param seconds - Seconds since midnight (0-86399)
 * @returns Time string in "HH:MM" format
 */
export function secondsToTimeStringShort(seconds: number): string {
  const timeString = secondsToTimeString(seconds);
  return timeString.substring(0, 5); // Remove ":SS" part
}

/**
 * Convert seconds since midnight to 12-hour format with AM/PM
 * @param seconds - Seconds since midnight (0-86399)
 * @param includeSeconds - Whether to include seconds in output
 * @returns Time string in "H:MM AM/PM" or "H:MM:SS AM/PM" format
 */
export function secondsToDisplayTime(seconds: number, includeSeconds = false): string {
  if (seconds < 0 || seconds >= SECONDS_PER_DAY) {
    throw new Error(`Invalid seconds: ${seconds}. Must be 0-86399`);
  }

  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const remainingSeconds = seconds % SECONDS_PER_HOUR;
  const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
  const secs = remainingSeconds % SECONDS_PER_MINUTE;

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  if (includeSeconds) {
    return `${displayHour}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${period}`;
  } else {
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}

/**
 * Calculate duration between two times in seconds
 * @param startSeconds - Start time in seconds since midnight
 * @param endSeconds - End time in seconds since midnight
 * @returns Duration in seconds
 */
export function calculateDurationSeconds(startSeconds: number, endSeconds: number): number {
  if (endSeconds < startSeconds) {
    throw new Error('End time must be after start time');
  }
  return endSeconds - startSeconds;
}

/**
 * Calculate duration between two times in hours (as decimal)
 * @param startSeconds - Start time in seconds since midnight
 * @param endSeconds - End time in seconds since midnight
 * @returns Duration in hours (e.g., 1.5 for 1 hour 30 minutes)
 */
export function calculateDurationHours(startSeconds: number, endSeconds: number): number {
  const durationSeconds = calculateDurationSeconds(startSeconds, endSeconds);
  return durationSeconds / SECONDS_PER_HOUR;
}

/**
 * Format duration in seconds to human readable format
 * @param durationSeconds - Duration in seconds
 * @returns Human readable duration (e.g., "2h 30m", "45m", "1h")
 */
export function formatDuration(durationSeconds: number): string {
  if (durationSeconds < 0) {
    throw new Error('Duration cannot be negative');
  }

  const hours = Math.floor(durationSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((durationSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Get which time period a given time falls into
 * @param seconds - Time in seconds since midnight
 * @returns Time period name
 */
export function getTimePeriod(seconds: number): TimePeriodName {
  if (seconds >= TIME_PERIODS.MORNING.startSeconds && seconds < TIME_PERIODS.MORNING.endSeconds) {
    return TIME_PERIODS.MORNING.name;
  } else if (seconds >= TIME_PERIODS.AFTERNOON.startSeconds && seconds < TIME_PERIODS.AFTERNOON.endSeconds) {
    return TIME_PERIODS.AFTERNOON.name;
  } else {
    return TIME_PERIODS.EVENING.name;
  }
}

/**
 * Get all time periods as an array (useful for UI components)
 * @returns Array of time periods with boundaries
 */
export function getTimePeriods() {
  return Object.values(TIME_PERIODS);
}

/**
 * Round time to nearest interval (useful for time pickers)
 * @param seconds - Time in seconds since midnight
 * @param intervalMinutes - Interval in minutes (e.g., 15 for 15-minute intervals)
 * @returns Rounded time in seconds
 */
export function roundTimeToInterval(seconds: number, intervalMinutes: number): number {
  const intervalSeconds = intervalMinutes * SECONDS_PER_MINUTE;
  return Math.round(seconds / intervalSeconds) * intervalSeconds;
}

/**
 * Validate that a time value is within valid range
 * @param seconds - Time in seconds since midnight
 * @returns True if valid, throws error if invalid
 */
export function validateTimeSeconds(seconds: number): boolean {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    throw new Error('Time must be a valid number');
  }
  if (seconds < 0 || seconds >= SECONDS_PER_DAY) {
    throw new Error(`Time must be between 0 and ${SECONDS_PER_DAY - 1} seconds`);
  }
  return true;
}

/**
 * Create time options for select dropdowns (useful for forms)
 * @param intervalMinutes - Interval between options in minutes
 * @param startHour - Starting hour (default: 0)
 * @param endHour - Ending hour (default: 24)
 * @returns Array of {value: seconds, label: displayTime} objects
 */
export function createTimeOptions(intervalMinutes = 15, startHour = 0, endHour = 24) {
  const options: Array<{ value: number; label: string }> = [];
  const intervalSeconds = intervalMinutes * SECONDS_PER_MINUTE;
  
  for (let seconds = startHour * SECONDS_PER_HOUR; seconds < endHour * SECONDS_PER_HOUR; seconds += intervalSeconds) {
    options.push({
      value: seconds,
      label: secondsToDisplayTime(seconds)
    });
  }
  
  return options;
}

/**
 * Parse HTML time input value (HH:MM) to seconds
 * @param timeValue - Value from HTML time input
 * @returns Seconds since midnight
 */
export function parseHtmlTimeInput(timeValue: string): number {
  if (!timeValue || !timeValue.includes(':')) {
    throw new Error('Invalid time input format');
  }
  return timeStringToSeconds(timeValue);
}

/**
 * Convert seconds to HTML time input value (HH:MM)
 * @param seconds - Seconds since midnight
 * @returns Time string suitable for HTML time input
 */
export function toHtmlTimeInput(seconds: number): string {
  return secondsToTimeStringShort(seconds);
}

// Legacy support functions (for migration from old TIME fields)
/**
 * Convert legacy TIME string to seconds (supports various formats)
 * @param legacyTime - Time in various legacy formats
 * @returns Seconds since midnight
 */
export function legacyTimeToSeconds(legacyTime: string): number {
  // Handle various legacy formats
  if (legacyTime.includes('T')) {
    // ISO format: extract time portion
    const timePart = legacyTime.split('T')[1].split('.')[0];
    return timeStringToSeconds(timePart);
  }
  
  // Assume HH:MM:SS or HH:MM format
  return timeStringToSeconds(legacyTime);
}