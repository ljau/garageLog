import dayjs from 'dayjs';

export const YEAR_MIN = 1900;

export function yearMax(): number {
  return new Date().getFullYear() + 1;
}

export function dateStringToPickerDate(value: string): Date {
  const parsed = dayjs(value, 'YYYY-MM-DD', true);
  return parsed.isValid() ? parsed.toDate() : new Date();
}

export function pickerDateToDateString(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function timeStringToPickerDate(value: string): Date {
  const parsed = dayjs(value, 'HH:mm', true);
  if (parsed.isValid()) {
    return parsed.toDate();
  }
  const fallback = dayjs().hour(9).minute(0).second(0).millisecond(0);
  return fallback.toDate();
}

export function pickerDateToTimeString(date: Date): string {
  return dayjs(date).format('HH:mm');
}

export function yearToPickerDate(year: number): Date {
  const clamped = Math.min(Math.max(year, YEAR_MIN), yearMax());
  return new Date(clamped, 0, 1, 12, 0, 0, 0);
}

export function pickerDateToYear(date: Date): number {
  return date.getFullYear();
}
