import { z } from 'zod';

export const faqItemSchema = z.object({
  id: z.string(),
  q: z.string(),
  a: z.string(),
  tags: z.array(z.string()).default([]),
});

export type FaqItem = z.infer<typeof faqItemSchema>;

export const chatItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  synonyms: z.array(z.string()).default([]),
  intents: z.array(z.string()).default([]),
  answer: z.string(),
  tags: z.array(z.string()).default([]),
});

export type ChatItem = z.infer<typeof chatItemSchema>;

export const availabilitySchema = z.object({
  date: z.string(),
  slots: z.array(z.string()),
  tz: z.string(),
});

export type AvailabilityDay = z.infer<typeof availabilitySchema>;

export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.string(),
  summary: z.string(),
  badge: z.string().optional(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const faqDataSchema = z.array(faqItemSchema);
export const chatDataSchema = z.array(chatItemSchema);
export const availabilityDataSchema = z.array(availabilitySchema);
export const calendarEventsSchema = z.array(calendarEventSchema);
