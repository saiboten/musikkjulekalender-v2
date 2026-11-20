import { describe, expect, it } from "vitest";
import { dayParts, matchGuess } from "./matchGuess";

const solutions = [
  { solution: "Roxanne", part: 1 },
  { solution: "St. Hans 1987", part: 2 },
  { solution: "St Hans 1987", part: 2 },
];

describe("matchGuess", () => {
  it("matches part 1", () => {
    expect(matchGuess("roxanne", solutions, [])).toEqual({
      kind: "new",
      part: 1,
    });
  });

  it("matches part 2 before part 1 is found", () => {
    expect(matchGuess("st hans 1987", solutions, [])).toEqual({
      kind: "new",
      part: 2,
    });
  });

  it("ignores case and surrounding whitespace", () => {
    expect(matchGuess("  ST. HANS 1987 ", solutions, [1])).toEqual({
      kind: "new",
      part: 2,
    });
  });

  it("reports a part that is already found", () => {
    expect(matchGuess("Roxanne", solutions, [1])).toEqual({
      kind: "alreadyFound",
      part: 1,
    });
  });

  it("prefers an unfound part when an answer is accepted for both", () => {
    const shared = [
      { solution: "Same", part: 1 },
      { solution: "Same", part: 2 },
    ];
    expect(matchGuess("same", shared, [1])).toEqual({ kind: "new", part: 2 });
  });

  it("returns wrong for no match or an empty guess", () => {
    expect(matchGuess("Hello", solutions, [])).toEqual({ kind: "wrong" });
    expect(matchGuess("   ", solutions, [])).toEqual({ kind: "wrong" });
  });
});

describe("dayParts", () => {
  it("has one part on ordinary days and two on dual days", () => {
    expect(dayParts({ dualAnswer: false })).toEqual([1]);
    expect(dayParts({ dualAnswer: true })).toEqual([1, 2]);
  });
});
