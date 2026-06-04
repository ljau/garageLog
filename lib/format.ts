import dayjs from 'dayjs';

export function formatMileage(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatDate(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY');
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('MMM D, YYYY h:mm A');
}

export function formatVehicleTitle(brand: string, model: string, year: number): string {
  return `${year} ${brand} ${model}`;
}

export function formatVehicleDisplayName(vehicle: {
  nickname?: string;
  brand: string;
  model: string;
  year: number;
}): string {
  const nickname = vehicle.nickname?.trim();
  if (nickname) {
    return nickname;
  }
  return formatVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);
}

export function formatCost(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
