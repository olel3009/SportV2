import { parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

interface UtcTimecodeResult {
  timestamp: number;
  isoString: string;
}

export function getUtcTimecodeFromGermanDate(
  germanDateString: string,
  timeZone: string = "Europe/Berlin"
): UtcTimecodeResult | null {
  try {
    const localDate = parse(germanDateString, 'dd.MM.yyyy', new Date());
    if (isNaN(localDate.getTime())) {
      return null;
    }
    const utcDate = fromZonedTime(localDate, timeZone);
    return {
      timestamp: utcDate.getTime(),
      isoString: utcDate.toISOString(),
    };
  } catch (error) {
    console.error('Error converting date:', error);
    return null;
  }
}
