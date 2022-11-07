import { calculatePoints } from "./answer";

test("Answer right away gives max score", () => {
  const res = calculatePoints([false, false, false]);
  expect(res).toBe(5);
});

test("One hint gives 3 points", () => {
  const res = calculatePoints([true, false, false]);
  expect(res).toBe(3);
});

test("two hints gives 2 points", () => {
  const res = calculatePoints([true, true, false]);
  expect(res).toBe(2);
});

test("three hints gives 1 points", () => {
  const res = calculatePoints([true, true, true]);
  expect(res).toBe(1);
});

