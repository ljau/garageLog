import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const vehicleFormSchema = z.object({
  nickname: z.string().trim().min(1, 'Nickname is required'),
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z
    .number()
    .int('Year must be a whole number')
    .min(1900, 'Year must be 1900 or later')
    .max(currentYear + 1, `Year cannot be after ${currentYear + 1}`),
  plateNumber: z.string().trim().optional(),
  currentMileage: z
    .number()
    .int('Mileage must be a whole number')
    .min(0, 'Mileage cannot be negative'),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function parseIntegerField(text: string, fallback = 0): number {
  const parsed = Number.parseInt(text, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
