/**
 * Tests for centralized time utilities
 * These utilities are critical infrastructure used throughout the application
 */

import { describe, it, expect } from '@jest/globals';
import {
  timeStringToSeconds,
  secondsToTimeString,
  secondsToTimeStringShort,
  secondsToDisplayTime,
  calculateDurationSeconds,
  calculateDurationHours,
  formatDuration,
  getTimePeriod,
  getTimePeriods,
  roundTimeToInterval,
  validateTimeSeconds,
  createTimeOptions,
  parseHtmlTimeInput,
  toHtmlTimeInput,
  legacyTimeToSeconds,
  formatTimeForDisplay,
  formatTimeRange,
  TIME_PERIODS,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_DAY
} from '../timeUtils';

describe('timeUtils', () => {
  describe('timeStringToSeconds', () => {
    it('should convert HH:MM format correctly', () => {
      expect(timeStringToSeconds('00:00')).toBe(0);
      expect(timeStringToSeconds('09:00')).toBe(32400); // 9 * 3600
      expect(timeStringToSeconds('12:30')).toBe(45000); // 12 * 3600 + 30 * 60
      expect(timeStringToSeconds('23:59')).toBe(86340); // 23 * 3600 + 59 * 60
    });

    it('should convert HH:MM:SS format correctly', () => {
      expect(timeStringToSeconds('00:00:00')).toBe(0);
      expect(timeStringToSeconds('09:00:30')).toBe(32430); // 9 * 3600 + 30
      expect(timeStringToSeconds('12:30:45')).toBe(45045); // 12 * 3600 + 30 * 60 + 45
      expect(timeStringToSeconds('23:59:59')).toBe(86399); // 23 * 3600 + 59 * 60 + 59
    });

    it('should handle edge cases', () => {
      expect(timeStringToSeconds('00:00:00')).toBe(0);
      expect(timeStringToSeconds('00:00:01')).toBe(1);
      expect(timeStringToSeconds('00:01:00')).toBe(60);
      expect(timeStringToSeconds('01:00:00')).toBe(3600);
    });

    it('should throw error for invalid formats', () => {
      expect(() => timeStringToSeconds('invalid')).toThrow('Invalid time format');
      expect(() => timeStringToSeconds('25:00')).toThrow('Invalid time values');
      expect(() => timeStringToSeconds('12:60')).toThrow('Invalid time values');
      expect(() => timeStringToSeconds('12:30:60')).toThrow('Invalid time values');
      expect(() => timeStringToSeconds('')).toThrow('Invalid time format');
      expect(() => timeStringToSeconds('12')).toThrow('Invalid time format');
    });
  });

  describe('secondsToTimeString', () => {
    it('should convert seconds to HH:MM:SS format correctly', () => {
      expect(secondsToTimeString(0)).toBe('00:00:00');
      expect(secondsToTimeString(32400)).toBe('09:00:00'); // 9 AM
      expect(secondsToTimeString(45000)).toBe('12:30:00'); // 12:30 PM
      expect(secondsToTimeString(86399)).toBe('23:59:59'); // 11:59:59 PM
    });

    it('should handle seconds component', () => {
      expect(secondsToTimeString(32430)).toBe('09:00:30'); // 9:00:30 AM
      expect(secondsToTimeString(45045)).toBe('12:30:45'); // 12:30:45 PM
    });

    it('should throw error for invalid seconds', () => {
      expect(() => secondsToTimeString(-1)).toThrow('Invalid seconds');
      expect(() => secondsToTimeString(86400)).toThrow('Invalid seconds');
      expect(() => secondsToTimeString(90000)).toThrow('Invalid seconds');
    });
  });

  describe('secondsToTimeStringShort', () => {
    it('should convert seconds to HH:MM format correctly', () => {
      expect(secondsToTimeStringShort(0)).toBe('00:00');
      expect(secondsToTimeStringShort(32400)).toBe('09:00');
      expect(secondsToTimeStringShort(45030)).toBe('12:30'); // Seconds ignored
      expect(secondsToTimeStringShort(86399)).toBe('23:59');
    });
  });

  describe('secondsToDisplayTime', () => {
    it('should convert to 12-hour format without seconds', () => {
      expect(secondsToDisplayTime(0)).toBe('12:00 AM'); // Midnight
      expect(secondsToDisplayTime(3600)).toBe('1:00 AM'); // 1 AM
      expect(secondsToDisplayTime(32400)).toBe('9:00 AM'); // 9 AM
      expect(secondsToDisplayTime(43200)).toBe('12:00 PM'); // Noon
      expect(secondsToDisplayTime(46800)).toBe('1:00 PM'); // 1 PM
      expect(secondsToDisplayTime(82800)).toBe('11:00 PM'); // 11 PM
    });

    it('should convert to 12-hour format with seconds when requested', () => {
      expect(secondsToDisplayTime(32430, true)).toBe('9:00:30 AM');
      expect(secondsToDisplayTime(45045, true)).toBe('12:30:45 PM');
    });

    it('should handle edge cases', () => {
      expect(secondsToDisplayTime(0)).toBe('12:00 AM');
      expect(secondsToDisplayTime(86399)).toBe('11:59 PM');
    });
  });

  describe('calculateDurationSeconds', () => {
    it('should calculate duration correctly', () => {
      expect(calculateDurationSeconds(32400, 46800)).toBe(14400); // 9 AM to 1 PM = 4 hours = 14400 seconds
      expect(calculateDurationSeconds(0, 3600)).toBe(3600); // 1 hour
      expect(calculateDurationSeconds(43200, 61200)).toBe(18000); // 12 PM to 5 PM = 5 hours
    });

    it('should throw error when end is before start', () => {
      expect(() => calculateDurationSeconds(46800, 32400)).toThrow('End time must be after start time');
    });

    it('should handle same start and end time', () => {
      expect(calculateDurationSeconds(32400, 32400)).toBe(0);
    });
  });

  describe('calculateDurationHours', () => {
    it('should calculate duration in hours correctly', () => {
      expect(calculateDurationHours(32400, 46800)).toBe(4); // 4 hours
      expect(calculateDurationHours(32400, 34200)).toBe(0.5); // 30 minutes = 0.5 hours
      expect(calculateDurationHours(0, 3600)).toBe(1); // 1 hour
    });
  });

  describe('formatDuration', () => {
    it('should format durations correctly', () => {
      expect(formatDuration(3600)).toBe('1h'); // 1 hour
      expect(formatDuration(1800)).toBe('30m'); // 30 minutes
      expect(formatDuration(5400)).toBe('1h 30m'); // 1.5 hours
      expect(formatDuration(7200)).toBe('2h'); // 2 hours
      expect(formatDuration(300)).toBe('5m'); // 5 minutes
      expect(formatDuration(0)).toBe('0m'); // 0 minutes
    });

    it('should throw error for negative duration', () => {
      expect(() => formatDuration(-1)).toThrow('Duration cannot be negative');
    });
  });

  describe('getTimePeriod', () => {
    it('should return correct time periods', () => {
      expect(getTimePeriod(0)).toBe('Morning'); // Midnight
      expect(getTimePeriod(32400)).toBe('Morning'); // 9 AM
      expect(getTimePeriod(43199)).toBe('Morning'); // 11:59:59 AM
      expect(getTimePeriod(43200)).toBe('Afternoon'); // 12:00 PM
      expect(getTimePeriod(50400)).toBe('Afternoon'); // 2 PM
      expect(getTimePeriod(61199)).toBe('Afternoon'); // 4:59:59 PM
      expect(getTimePeriod(61200)).toBe('Evening'); // 5:00 PM
      expect(getTimePeriod(75600)).toBe('Evening'); // 9 PM
      expect(getTimePeriod(86399)).toBe('Evening'); // 11:59:59 PM
    });
  });

  describe('getTimePeriods', () => {
    it('should return all time periods', () => {
      const periods = getTimePeriods();
      expect(periods).toHaveLength(3);
      expect(periods[0]).toEqual({ name: 'Morning', startSeconds: 0, endSeconds: 43200 });
      expect(periods[1]).toEqual({ name: 'Afternoon', startSeconds: 43200, endSeconds: 61200 });
      expect(periods[2]).toEqual({ name: 'Evening', startSeconds: 61200, endSeconds: 86400 });
    });
  });

  describe('roundTimeToInterval', () => {
    it('should round to 15-minute intervals', () => {
      expect(roundTimeToInterval(32400, 15)).toBe(32400); // 9:00 AM (already on interval)
      expect(roundTimeToInterval(32430, 15)).toBe(32400); // 9:00:30 AM -> 9:00 AM
      expect(roundTimeToInterval(32470, 15)).toBe(32400); // 9:00:40 AM -> 9:00 AM
      expect(roundTimeToInterval(32850, 15)).toBe(33300); // 9:07:30 AM -> 9:15 AM
    });

    it('should round to 30-minute intervals', () => {
      expect(roundTimeToInterval(32400, 30)).toBe(32400); // 9:00 AM
      expect(roundTimeToInterval(33300, 30)).toBe(34200); // 9:15 AM -> 9:30 AM
      expect(roundTimeToInterval(34200, 30)).toBe(34200); // 9:30 AM
    });
  });

  describe('validateTimeSeconds', () => {
    it('should validate correct time values', () => {
      expect(validateTimeSeconds(0)).toBe(true);
      expect(validateTimeSeconds(43200)).toBe(true);
      expect(validateTimeSeconds(86399)).toBe(true);
    });

    it('should throw error for invalid values', () => {
      expect(() => validateTimeSeconds(-1)).toThrow('Time must be between 0 and 86399 seconds');
      expect(() => validateTimeSeconds(86400)).toThrow('Time must be between 0 and 86399 seconds');
      expect(() => validateTimeSeconds(NaN)).toThrow('Time must be a valid number');
      expect(() => validateTimeSeconds('invalid' as any)).toThrow('Time must be a valid number');
    });
  });

  describe('createTimeOptions', () => {
    it('should create 15-minute interval options', () => {
      const options = createTimeOptions(15, 9, 11); // 9 AM to 11 AM, 15-min intervals
      expect(options).toHaveLength(8); // 9:00, 9:15, 9:30, 9:45, 10:00, 10:15, 10:30, 10:45
      expect(options[0]).toEqual({ value: 32400, label: '9:00 AM' });
      expect(options[1]).toEqual({ value: 33300, label: '9:15 AM' });
      expect(options[7]).toEqual({ value: 38700, label: '10:45 AM' });
    });

    it('should create 30-minute interval options', () => {
      const options = createTimeOptions(30, 12, 14); // 12 PM to 2 PM, 30-min intervals
      expect(options).toHaveLength(4); // 12:00, 12:30, 1:00, 1:30
      expect(options[0]).toEqual({ value: 43200, label: '12:00 PM' });
      expect(options[3]).toEqual({ value: 48600, label: '1:30 PM' });
    });
  });

  describe('parseHtmlTimeInput', () => {
    it('should parse HTML time input correctly', () => {
      expect(parseHtmlTimeInput('09:00')).toBe(32400);
      expect(parseHtmlTimeInput('12:30')).toBe(45000);
      expect(parseHtmlTimeInput('23:59')).toBe(86340);
    });

    it('should throw error for invalid input', () => {
      expect(() => parseHtmlTimeInput('')).toThrow('Invalid time input format');
      expect(() => parseHtmlTimeInput('invalid')).toThrow('Invalid time input format');
    });
  });

  describe('toHtmlTimeInput', () => {
    it('should convert seconds to HTML time input format', () => {
      expect(toHtmlTimeInput(32400)).toBe('09:00');
      expect(toHtmlTimeInput(45000)).toBe('12:30');
      expect(toHtmlTimeInput(86340)).toBe('23:59');
    });
  });

  describe('legacyTimeToSeconds', () => {
    it('should convert legacy TIME strings', () => {
      expect(legacyTimeToSeconds('09:00:00')).toBe(32400);
      expect(legacyTimeToSeconds('12:30:45')).toBe(45045);
    });

    it('should handle ISO format times', () => {
      expect(legacyTimeToSeconds('2023-01-01T09:00:00')).toBe(32400);
      expect(legacyTimeToSeconds('2023-01-01T12:30:45.123Z')).toBe(45045);
    });
  });

  describe('time constants', () => {
    it('should have correct constant values', () => {
      expect(SECONDS_PER_MINUTE).toBe(60);
      expect(SECONDS_PER_HOUR).toBe(3600);
      expect(SECONDS_PER_DAY).toBe(86400);
    });

    it('should have correct time period definitions', () => {
      expect(TIME_PERIODS.MORNING.startSeconds).toBe(0);
      expect(TIME_PERIODS.MORNING.endSeconds).toBe(43200);
      expect(TIME_PERIODS.AFTERNOON.startSeconds).toBe(43200);
      expect(TIME_PERIODS.AFTERNOON.endSeconds).toBe(61200);
      expect(TIME_PERIODS.EVENING.startSeconds).toBe(61200);
      expect(TIME_PERIODS.EVENING.endSeconds).toBe(86400);
    });
  });

  describe('integration tests', () => {
    it('should handle round-trip conversions correctly', () => {
      const testTimes = ['09:00:00', '12:30:45', '17:15:30', '23:59:59'];
      
      testTimes.forEach(timeString => {
        const seconds = timeStringToSeconds(timeString);
        const backToString = secondsToTimeString(seconds);
        expect(backToString).toBe(timeString);
      });
    });

    it('should maintain accuracy in calculations', () => {
      const start = timeStringToSeconds('09:00:00');
      const end = timeStringToSeconds('17:00:00');
      const duration = calculateDurationSeconds(start, end);
      const hours = calculateDurationHours(start, end);
      
      expect(duration).toBe(28800); // 8 hours in seconds
      expect(hours).toBe(8);
      expect(formatDuration(duration)).toBe('8h');
    });

    it('should work correctly with HTML time inputs', () => {
      const htmlTime = '14:30';
      const seconds = parseHtmlTimeInput(htmlTime);
      const backToHtml = toHtmlTimeInput(seconds);
      const displayTime = secondsToDisplayTime(seconds);
      
      expect(backToHtml).toBe(htmlTime);
      expect(displayTime).toBe('2:30 PM');
    });
  });

  describe('formatTimeForDisplay (minimal schedule format)', () => {
    it('should format times without :00 for hours (no AM/PM)', () => {
      expect(formatTimeForDisplay(28800)).toBe('8');      // 8:00 AM -> "8"
      expect(formatTimeForDisplay(43200)).toBe('12');     // 12:00 PM -> "12"
      expect(formatTimeForDisplay(61200)).toBe('5');      // 5:00 PM -> "5"
      expect(formatTimeForDisplay(0)).toBe('12');         // 12:00 AM -> "12"
      expect(formatTimeForDisplay(3600)).toBe('1');       // 1:00 AM -> "1"
      expect(formatTimeForDisplay(39600)).toBe('11');     // 11:00 AM -> "11"
    });

    it('should show minutes when not zero', () => {
      expect(formatTimeForDisplay(30600)).toBe('8:30');   // 8:30 AM -> "8:30"
      expect(formatTimeForDisplay(31500)).toBe('8:45');   // 8:45 AM -> "8:45"
      expect(formatTimeForDisplay(45900)).toBe('12:45');  // 12:45 PM -> "12:45"
      expect(formatTimeForDisplay(63900)).toBe('5:45');   // 5:45 PM -> "5:45"
      expect(formatTimeForDisplay(4500)).toBe('1:15');    // 1:15 AM -> "1:15"
    });

    it('should handle afternoon times correctly (12-hour format)', () => {
      expect(formatTimeForDisplay(46800)).toBe('1');      // 1:00 PM -> "1"
      expect(formatTimeForDisplay(50400)).toBe('2');      // 2:00 PM -> "2"
      expect(formatTimeForDisplay(54000)).toBe('3');      // 3:00 PM -> "3"
      expect(formatTimeForDisplay(57600)).toBe('4');      // 4:00 PM -> "4"
      expect(formatTimeForDisplay(48600)).toBe('1:30');   // 1:30 PM -> "1:30"
    });

    it('should handle evening times correctly', () => {
      expect(formatTimeForDisplay(64800)).toBe('6');      // 6:00 PM -> "6"
      expect(formatTimeForDisplay(72000)).toBe('8');      // 8:00 PM -> "8"
      expect(formatTimeForDisplay(75600)).toBe('9');      // 9:00 PM -> "9"
      expect(formatTimeForDisplay(82800)).toBe('11');     // 11:00 PM -> "11"
      expect(formatTimeForDisplay(66600)).toBe('6:30');   // 6:30 PM -> "6:30"
    });

    it('should handle midnight and noon correctly', () => {
      expect(formatTimeForDisplay(0)).toBe('12');         // 12:00 AM -> "12"
      expect(formatTimeForDisplay(43200)).toBe('12');     // 12:00 PM -> "12"
      expect(formatTimeForDisplay(1800)).toBe('12:30');   // 12:30 AM -> "12:30"
      expect(formatTimeForDisplay(45000)).toBe('12:30');  // 12:30 PM -> "12:30"
    });

    it('should throw error for invalid times', () => {
      expect(() => formatTimeForDisplay(-1)).toThrow();
      expect(() => formatTimeForDisplay(86400)).toThrow();
      expect(() => formatTimeForDisplay(100000)).toThrow();
    });
  });

  describe('formatTimeRange (minimal schedule format)', () => {
    it('should format time ranges without :00 for hours (no AM/PM)', () => {
      expect(formatTimeRange(28800, 43200)).toBe('8 - 12');        // 8:00 AM - 12:00 PM -> "8 - 12"
      expect(formatTimeRange(32400, 61200)).toBe('9 - 5');         // 9:00 AM - 5:00 PM -> "9 - 5"
      expect(formatTimeRange(43200, 61200)).toBe('12 - 5');        // 12:00 PM - 5:00 PM -> "12 - 5"
      expect(formatTimeRange(3600, 7200)).toBe('1 - 2');           // 1:00 AM - 2:00 AM -> "1 - 2"
    });

    it('should show minutes when present', () => {
      expect(formatTimeRange(30600, 43200)).toBe('8:30 - 12');     // 8:30 AM - 12:00 PM -> "8:30 - 12"
      expect(formatTimeRange(28800, 52200)).toBe('8 - 2:30');      // 8:00 AM - 2:30 PM -> "8 - 2:30"
      expect(formatTimeRange(30600, 59400)).toBe('8:30 - 4:30');   // 8:30 AM - 4:30 PM -> "8:30 - 4:30"
      expect(formatTimeRange(5400, 10800)).toBe('1:30 - 3');       // 1:30 AM - 3:00 AM -> "1:30 - 3"
    });

    it('should handle cross-meridiem shifts (your examples)', () => {
      expect(formatTimeRange(3600, 7200)).toBe('1 - 2');           // 1:00 AM - 2:00 AM -> "1 - 2"
      expect(formatTimeRange(5400, 10800)).toBe('1:30 - 3');       // 1:30 AM - 3:00 AM -> "1:30 - 3"
      expect(formatTimeRange(39600, 46800)).toBe('11 - 1');        // 11:00 AM - 1:00 PM -> "11 - 1"
      expect(formatTimeRange(82800, 3600)).toBe('11 - 1');         // Would need special handling for overnight
    });

    it('should handle various shift patterns', () => {
      expect(formatTimeRange(25200, 54000)).toBe('7 - 3');         // 7:00 AM - 3:00 PM -> "7 - 3"
      expect(formatTimeRange(54000, 82800)).toBe('3 - 11');        // 3:00 PM - 11:00 PM -> "3 - 11"
      expect(formatTimeRange(27900, 34200)).toBe('7:45 - 9:30');   // 7:45 AM - 9:30 AM -> "7:45 - 9:30"
    });
  });
});