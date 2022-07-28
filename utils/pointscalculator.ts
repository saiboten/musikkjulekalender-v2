import { addHours, isBefore } from "date-fns";
import { hint1hours, hint2hours, hint3hours } from "../components/constants";

export function calculatePoints(currentTime: Date, day: Date) {
  let points = 1;

  const hint1time = addHours(day, hint1hours);
  const hint2time = addHours(day, hint2hours);
  const hint3time = addHours(day, hint3hours);

  if (isBefore(currentTime, hint1time)) {
    points = 5;
  } else if (isBefore(currentTime, hint2time)) {
    points = 3;
  } else if (isBefore(currentTime, hint3time)) {
    points = 2;
  }

  return points;
}
