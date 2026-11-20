import { describe, expect, test } from "vitest";
import { computeDayStats } from "./dayStats";

const dayDate = new Date("2026-12-01T08:00:00.000Z");
const after = (minutes: number) =>
  new Date(dayDate.getTime() + minutes * 60_000);

const answer = (name: string, minutes: number, points: number) => ({
  name,
  points,
  timeOfEntry: after(minutes),
});

describe("computeDayStats", () => {
  test("empty day", () => {
    const stats = computeDayStats({
      dayDate,
      answers: [],
      guesses: [],
      activePlayers: 0,
    });
    expect(stats).toEqual({
      solvedCount: 0,
      partialCount: null,
      solveRate: null,
      pointsSplit: { 5: 0, 3: 0, 2: 0, 1: 0 },
      firstSolver: null,
      medianMinutes: null,
      guesses: null,
    });
  });

  test("points split, first solver, odd median and solve rate", () => {
    const stats = computeDayStats({
      dayDate,
      answers: [
        answer("Kari", 70, 3),
        answer("Ola", 4, 5),
        answer("Per", 200, 1),
      ],
      guesses: [],
      activePlayers: 6,
    });
    expect(stats.solvedCount).toBe(3);
    expect(stats.solveRate).toBe(0.5);
    expect(stats.pointsSplit).toEqual({ 5: 1, 3: 1, 2: 0, 1: 1 });
    expect(stats.firstSolver).toEqual({ name: "Ola", minutesAfterOpen: 4 });
    expect(stats.medianMinutes).toBe(70);
  });

  test("even median is the rounded average of the middle two", () => {
    const stats = computeDayStats({
      dayDate,
      answers: [answer("A", 10, 5), answer("B", 25, 5)],
      guesses: [],
      activePlayers: 2,
    });
    expect(stats.medianMinutes).toBe(18);
  });

  test("guess stats count only users with logged guesses", () => {
    const stats = computeDayStats({
      dayDate,
      // User 99 solved before guesses were logged and has no guess rows.
      answers: [answer("A", 10, 5), answer("B", 80, 3), answer("Old", 5, 5)],
      guesses: [
        { userId: 1, correct: false },
        { userId: 1, correct: false },
        { userId: 1, correct: true },
        { userId: 2, correct: true },
        { userId: 3, correct: false },
      ],
      activePlayers: 10,
    });
    expect(stats.guesses).toEqual({
      total: 5,
      players: 3,
      solvedPercent: 2 / 3,
      avgPerSolver: 2,
    });
  });

  test("no solvers among guessers gives no average", () => {
    const stats = computeDayStats({
      dayDate,
      answers: [],
      guesses: [{ userId: 1, correct: false }],
      activePlayers: 1,
    });
    expect(stats.guesses).toEqual({
      total: 1,
      players: 1,
      solvedPercent: 0,
      avgPerSolver: null,
    });
  });

  test("dual-answer day: solved once both songs are found", () => {
    const stats = computeDayStats({
      dayDate,
      parts: 2,
      answers: [
        { ...answer("Ola", 10, 5), userId: 1 },
        { ...answer("Ola", 130, 2), userId: 1 },
        { ...answer("Kari", 30, 5), userId: 2 },
        { ...answer("Kari", 50, 5), userId: 2 },
        { ...answer("Per", 5, 5), userId: 3 },
      ],
      guesses: [],
      activePlayers: 4,
    });
    expect(stats.solvedCount).toBe(2);
    expect(stats.partialCount).toBe(1);
    expect(stats.solveRate).toBe(0.5);
    // Each song found counts in the split.
    expect(stats.pointsSplit).toEqual({ 5: 4, 3: 0, 2: 1, 1: 0 });
    // Kari found her second song at 50 min, before Ola's at 130.
    expect(stats.firstSolver).toEqual({ name: "Kari", minutesAfterOpen: 50 });
    expect(stats.medianMinutes).toBe(90);
  });
});
