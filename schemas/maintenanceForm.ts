import dayjs from 'dayjs';
import { z } from 'zod';

export const maintenanceFormSchema = z.object({
  type: z.string().trim().min(1, 'Type is required'),
  description: z.string().trim().min(1, 'Description is required'),
  cost: z
    .number()
    .min(0, 'Cost cannot be negative')
    .optional(),
  mileage: z
    .number()
    .int('Mileage must be a whole number')
    .min(0, 'Mileage cannot be negative'),
  serviceDate: z
    .string()
    .trim()
    .min(1, 'Service date is required')
    .refine((value) => dayjs(value, 'YYYY-MM-DD', true).isValid(), {
      message: 'Use YYYY-MM-DD format',
    }),
  notes: z.string().trim().optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export function parseOptionalCost(text: string): number | undefined {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}
