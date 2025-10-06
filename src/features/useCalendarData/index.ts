import availabilityJson from '@data/availability.json';
import calendarEventsJson from '@data/calendar-events.json';
import { availabilityDataSchema, calendarEventsSchema } from '@shared/types';
import { validateJson } from '@shared/lib/validate-json';

const availabilityData = validateJson(availabilityDataSchema, availabilityJson, 'availability');
const calendarEvents = validateJson(calendarEventsSchema, calendarEventsJson, 'calendar events');

export function useCalendarData() {
  return {
    availability: availabilityData,
    events: calendarEvents,
  };
}
