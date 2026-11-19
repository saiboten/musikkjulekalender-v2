import { expect, test } from "vitest";
import {
  calculatePoints,
  calculatePointsAt,
  getOpenHintCount,
} from "./pointscalculator";

// Days open at 08:00 UTC (09:00 in Oslo).
const dayDate = new Date("2026-12-01T08:00:00.000Z");
const at = (time: string) => new Date(`2026-12-01T${time}Z`);

test("points by number of open hints", () => {
  expect(calculatePoints(0)).toBe(5);
  expect(calculatePoints(1)).toBe(3);
  expect(calculatePoints(2)).toBe(2);
  expect(calculatePoints(3)).toBe(1);
});

test("open hint count follows the clock", () => {
  expect(getOpenHintCount(dayDate, at("07:59:00"))).toBe(0);
  expect(getOpenHintCount(dayDate, at("08:30:00"))).toBe(0);
  expect(getOpenHintCount(dayDate, at("09:00:00"))).toBe(1);
  expect(getOpenHintCount(dayDate, at("10:59:59"))).toBe(2);
  expect(getOpenHintCount(dayDate, at("11:00:00"))).toBe(3);
  expect(getOpenHintCount(dayDate, at("22:00:00"))).toBe(3);
});

test("points by time of answer", () => {
  expect(calculatePointsAt(dayDate, at("08:30:00"))).toBe(5); // 09:30 Oslo
  expect(calculatePointsAt(dayDate, at("09:00:00"))).toBe(3); // 10:00
  expect(calculatePointsAt(dayDate, at("10:59:00"))).toBe(2); // 11:59
  expect(calculatePointsAt(dayDate, at("11:00:00"))).toBe(1); // 12:00
  expect(calculatePointsAt(dayDate, at("22:00:00"))).toBe(1); // 23:00
});
