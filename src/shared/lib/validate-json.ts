import { z } from 'zod';

export function validateJson<T>(schema: z.ZodSchema<T>, data: unknown, friendlyName: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.error(`Failed to load ${friendlyName}`, result.error.flatten());
    }
    throw new Error(`We couldn't load ${friendlyName} right now. Please try again later.`);
  }
  return result.data;
}
