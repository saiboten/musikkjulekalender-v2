import { addHours, parse } from "date-fns";
import { format } from "path";
import { hint1hours, hint2hours, hint3hours } from "../../components/constants";
import { calculatePoints } from "./answer";

const startOfDay = parse('02/11/2014', 'MM/dd/yyyy', new Date())

test("Answer right away gives max score", () => {
  const res = calculatePoints(startOfDay, startOfDay);
  expect(res).toBe(5);
});

test("Answer after 1 hour gives max score", () => {
  const res = calculatePoints(addHours(startOfDay, 1), startOfDay);
  expect(res).toBe(5);
});

test("Answer after 1 hint time hour gives some points", () => {
  const res = calculatePoints(addHours(startOfDay, hint1hours), startOfDay);
  expect(res).toBe(3);
});

test("Answer after 2 hint time hour gives less points", () => {
  const res = calculatePoints(addHours(startOfDay, hint2hours), startOfDay);
  expect(res).toBe(2);
});

test("Answer after 3 hint time hour gives min points", () => {
  const res = calculatePoints(addHours(startOfDay, hint3hours), startOfDay);
  expect(res).toBe(1);
});

