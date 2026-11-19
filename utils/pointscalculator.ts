import { addHours } from "date-fns";

const HOUR_MS = 60 * 60 * 1000;

/** Number of hints that are open at `now`. Hint N opens N hours after the day opens. */
export function getOpenHintCount(dayDate: Date, now: Date): 0 | 1 | 2 | 3 {
  const hours = Math.floor((now.getTime() - dayDate.getTime()) / HOUR_MS);
  return Math.min(3, Math.max(0, hours)) as 0 | 1 | 2 | 3;
}

export function getHintOpenTime(dayDate: Date, hintNumber: 1 | 2 | 3) {
  return addHours(dayDate, hintNumber);
}

export function calculatePoints(openHints: number) {
  switch (openHints) {
    case 0:
      return 5;
    case 1:
      return 3;
    case 2:
      return 2;
    default:
      return 1;
  }
}

/** Points for a correct answer at `now`: depends only on the time of day. */
export function calculatePointsAt(dayDate: Date, now: Date) {
  return calculatePoints(getOpenHintCount(dayDate, now));
}
