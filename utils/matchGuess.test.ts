import { describe, expect, it } from "vitest";
import { acceptedAnswers, dayTargets, matchGuess } from "./matchGuess";

const day = {
  dualAnswer: true,
  hasTextSolution: false,
  artist: "The Police",
  song: "Roxanne",
  artist2: "Tønes",
  song2: "St. Hans 1987",
};
const extras = [
  { solution: "Police", part: 1, kind: "artist" },
  { solution: "St Hans 1987", part: 2, kind: "song" },
];
const accepted = acceptedAnswers(day, extras);

describe("dayTargets", () => {
  it("has an artist and a song per song", () => {
    expect(dayTargets({ dualAnswer: false, hasTextSolution: false })).toEqual([
      { part: 1, kind: "artist" },
      { part: 1, kind: "song" },
    ]);
    expect(dayTargets(day)).toHaveLength(4);
  });

  it("has only an answer on text puzzles", () => {
    expect(dayTargets({ dualAnswer: false, hasTextSolution: true })).toEqual([
      { part: 1, kind: "song" },
    ]);
  });
});

describe("matchGuess", () => {
  it("accepts the answer key's artist and song without extras", () => {
    expect(matchGuess("the police", "artist", accepted, [])).toEqual({
      kind: "new",
      part: 1,
    });
    expect(matchGuess("ROXANNE ", "song", accepted, [])).toEqual({
      kind: "new",
      part: 1,
    });
  });

  it("accepts extra spellings of the right kind", () => {
    expect(matchGuess("police", "artist", accepted, [])).toEqual({
      kind: "new",
      part: 1,
    });
    expect(matchGuess("st hans 1987", "song", accepted, [])).toEqual({
      kind: "new",
      part: 2,
    });
  });

  it("does not accept an artist in the song field", () => {
    expect(matchGuess("The Police", "song", accepted, [])).toEqual({
      kind: "wrong",
    });
  });

  it("reports something already found", () => {
    expect(
      matchGuess("roxanne", "song", accepted, [{ part: 1, kind: "song" }])
    ).toEqual({ kind: "alreadyFound", part: 1 });
  });

  it("prefers an unfound part when an answer is accepted for both", () => {
    const shared = acceptedAnswers({ ...day, artist2: "The Police" }, []);
    expect(
      matchGuess("the police", "artist", shared, [{ part: 1, kind: "artist" }])
    ).toEqual({ kind: "new", part: 2 });
  });

  it("returns wrong for no match or an empty guess", () => {
    expect(matchGuess("Hello", "song", accepted, [])).toEqual({
      kind: "wrong",
    });
    expect(matchGuess("   ", "artist", accepted, [])).toEqual({
      kind: "wrong",
    });
  });
});
