import dayjs from 'dayjs';

export function formatMileage(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY');
}

export function formatVehicleTitle(brand: string, model: string, year: number): string {
  return `${year} ${brand} ${model}`;
}
