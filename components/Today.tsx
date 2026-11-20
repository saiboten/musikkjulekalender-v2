"use client";

import { Button, Input, Label, cn, useToast } from "./ui";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DayWithAdmin } from "./Day";
import { BestDaily } from "./BestDaily";
import { DayStats } from "./DayStats";
import {
  Card,
  DayFooter,
  DayShell,
  DayTask,
  dayBoxClasses,
  HintAudio,
  HintRow,
  Pill,
  SongList,
} from "./DayLayout";

function formatTime(iso?: string) {
  return iso ? format(new Date(iso), "HH:mm") : "";
}

type FieldResult = "correct" | "wrong" | "alreadyFound";

const resultText: Record<FieldResult, string> = {
  correct: "riktig ✓",
  wrong: "feil",
  alreadyFound: "allerede funnet",
};

export const Today: React.FC<DayWithAdmin> = (props) => {
  const [artistGuess, setArtistGuess] = useState("");
  const [songGuess, setSongGuess] = useState("");
  const router = useRouter();

  const points = props.points;
  const solved = props.solved;
  const toast = useToast();
  const openHints = props.openHints ?? 0;
  const hintOpenTimes = props.hintOpenTimes ?? [];
  const dual = !!props.dualAnswer;
  const text = !!props.hasTextSolution;
  const found = props.found ?? [];
  const has = (part: number, kind: "artist" | "song") =>
    found.includes(`${part}-${kind}`);
  const songs = [
    { part: 1, artist: props.artist, song: props.song },
    ...(dual ? [{ part: 2, artist: props.artist2, song: props.song2 }] : []),
  ];
  const parts = songs.map((s) => s.part);
  const needArtist = !text && parts.some((p) => !has(p, "artist"));
  const needSong = parts.some((p) => !has(p, "song"));
  const songLabel = text ? "Svar" : "Sang";
  const kinds = text ? (["song"] as const) : (["artist", "song"] as const);
  // A plain text puzzle has one answer; other days have several things to find.
  const severalTargets = !text || dual;

  const hints = [
    { hint: props.hint1, file: props.hasFileHint1 },
    { hint: props.hint2, file: props.hasFileHint2 },
    { hint: props.hint3, file: props.hasFileHint3 },
  ]
    .map((el, index) => ({
      ...el,
      number: index + 1,
      isOpen: solved || index < openHints,
      openTime: hintOpenTimes[index],
      exists: props.hintExists?.[index] ?? false,
    }))
    .filter((el) => el.exists);

  const pointSteps = [
    { label: `Før ${formatTime(hintOpenTimes[0])}`, points: 5 },
    { label: `Fra ${formatTime(hintOpenTimes[0])}`, points: 3 },
    { label: `Fra ${formatTime(hintOpenTimes[1])}`, points: 2 },
    { label: `Fra ${formatTime(hintOpenTimes[2])}`, points: 1 },
  ];

  // Refresh when the next hint opens (and the points drop), so the page
  // shows the new hint without a manual reload.
  const nextChange = solved ? undefined : hintOpenTimes[openHints];
  useEffect(() => {
    if (!nextChange) return;
    const delay = Math.max(0, new Date(nextChange).getTime() - Date.now());
    const timeout = setTimeout(() => router.refresh(), delay + 1000);
    return () => clearTimeout(timeout);
  }, [nextChange, router]);

  const canGuess =
    (needArtist && artistGuess.trim() !== "") ||
    (needSong && songGuess.trim() !== "");

  async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams({ dayId: String(props.id) });
    if (needArtist && artistGuess.trim()) {
      params.set("artist", artistGuess.trim());
    }
    if (needSong && songGuess.trim()) params.set("song", songGuess.trim());
    setArtistGuess("");
    setSongGuess("");

    const res: {
      results?: Partial<Record<"artist" | "song", FieldResult>>;
      done?: boolean;
    } = await (await fetch(`/api/answer?${params}`)).json();

    const entries = Object.entries(res.results ?? {}) as [
      "artist" | "song",
      FieldResult,
    ][];
    const anyCorrect = entries.some(([, r]) => r === "correct");
    const allCorrect =
      entries.length > 0 && entries.every(([, r]) => r === "correct");
    const onlyAlreadyFound =
      entries.length > 0 && entries.every(([, r]) => r === "alreadyFound");

    if (entries.length > 0) {
      const title = res.done
        ? "Riktig!"
        : allCorrect
          ? "Riktig"
          : anyCorrect
            ? "Delvis riktig"
            : onlyAlreadyFound
              ? "Allerede funnet"
              : "Galt";
      const description = res.done
        ? "Du fant alt – godt jobba!"
        : severalTargets
          ? entries
              .map(
                ([field, r]) =>
                  `${field === "artist" ? "Artist" : songLabel}: ${resultText[r]}`
              )
              .join(" · ")
          : "Det var dessverre feil, prøv igjen!";
      toast({
        title,
        description,
        status: anyCorrect ? "success" : onlyAlreadyFound ? "info" : "error",
        duration: 6000,
        isClosable: true,
      });
    }

    if (res.done) {
      window.location.reload();
    } else if (anyCorrect) {
      router.refresh();
    }
  }

  return (
    <DayShell id={props.id} date={props.date} madeBy={props.madeBy}>
      <DayTask
        id={props.id}
        video={props.video}
        hasTextSolution={props.hasTextSolution}
        description={props.description}
      />

      {solved ? (
        <Card
          tone="success"
          title="Fasit"
          aside={<Pill tone="success">Du fikk {points} poeng</Pill>}
        >
          <SongList songs={songs} numbered={dual} />
          {props.solutionDescription ? (
            <p className="mt-3 text-gray-700">{props.solutionDescription}</p>
          ) : null}
        </Card>
      ) : (
        <Card
          title="Ditt svar"
          aside={
            <Pill>
              {severalTargets
                ? `${points} poeng per riktig svar nå`
                : `Verdt ${points} poeng nå`}
            </Pill>
          }
        >
          {severalTargets ? (
            <div className="mb-5 space-y-3">
              <p className="text-gray-700">
                {dual ? (
                  <>
                    Denne dagen skjuler <strong>to sanger</strong>.{" "}
                  </>
                ) : null}
                {text
                  ? "Hvert riktig svar gir poeng for seg."
                  : "Gjett både artist og sang – hvert riktig svar gir poeng for seg."}
              </p>
              <ul className={cn("grid gap-2", dual && "sm:grid-cols-2")}>
                {songs.map((s) => (
                  <li
                    key={s.part}
                    className="rounded-lg border border-gray-200 px-3 py-2"
                  >
                    {dual ? (
                      <span className="mb-1 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Sang {s.part}
                      </span>
                    ) : null}
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                      {kinds.map((kind) => {
                        const ok = has(s.part, kind);
                        const value = kind === "artist" ? s.artist : s.song;
                        return (
                          <React.Fragment key={kind}>
                            <dt className="text-gray-600">
                              {kind === "artist" ? "Artist" : songLabel}
                            </dt>
                            <dd
                              className={cn(
                                "font-medium",
                                ok ? "text-green-800" : "text-gray-400"
                              )}
                            >
                              {ok ? `✓ ${value}` : "Ikke funnet ennå"}
                            </dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </li>
                ))}
              </ul>
              {found.length > 0 ? (
                <p className="text-sm text-gray-700">
                  Du har <strong>{props.earnedPoints ?? 0}</strong> poeng så
                  langt.
                </p>
              ) : null}
            </div>
          ) : null}

          <form
            onSubmit={handleAnswer}
            className={cn(
              "grid items-end gap-2",
              needArtist && needSong
                ? "sm:grid-cols-[1fr_1fr_auto]"
                : "grid-cols-[1fr_auto]"
            )}
          >
            {needArtist ? (
              <div>
                <Label htmlFor="artist-guess" className="mb-1 text-sm">
                  Artist
                </Label>
                <Input
                  id="artist-guess"
                  placeholder="Hvem er artisten?"
                  autoComplete="off"
                  value={artistGuess}
                  onChange={(e) => setArtistGuess(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
            ) : null}
            {needSong ? (
              <div>
                <Label htmlFor="song-guess" className="mb-1 text-sm">
                  {songLabel}
                </Label>
                <Input
                  id="song-guess"
                  placeholder={
                    text ? "Skriv ditt svar her" : "Hva heter sangen?"
                  }
                  autoComplete="off"
                  value={songGuess}
                  onChange={(e) => setSongGuess(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={!canGuess}
              className="h-11 bg-primary text-white hover:bg-[#741111] active:bg-[#5c0d0d] disabled:hover:bg-primary"
            >
              Gjett
            </Button>
          </form>

          <div className="mt-5">
            <p className="mb-2 text-sm text-gray-600">
              Jo tidligere du svarer, jo flere poeng
              {severalTargets ? " per riktig svar" : ""}:
            </p>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {pointSteps.map((step, index) => {
                const current = index === Math.min(openHints, 3);
                const past = index < openHints;
                return (
                  <li
                    key={step.points}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-center",
                      current
                        ? "border-primary bg-primary/5 text-primary"
                        : past
                          ? "border-gray-100 text-gray-400 line-through"
                          : "border-gray-200 text-gray-700"
                    )}
                  >
                    <span className="block text-lg leading-tight font-bold">
                      {step.points} p
                    </span>
                    <span className="text-xs">{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Card>
      )}

      {props.hasHints ? (
        <Card title="Hint">
          <ol className="space-y-4">
            {hints.map(({ number, hint, file, isOpen, openTime }) => (
              <HintRow key={number} number={number} locked={!isOpen}>
                {!isOpen ? (
                  <p className="text-gray-500">
                    Åpner kl. {formatTime(openTime)}
                  </p>
                ) : (
                  <>
                    {hint ? (
                      <p className="whitespace-pre-line">{hint}</p>
                    ) : null}
                    {file ? <HintAudio id={props.id} number={number} /> : null}
                  </>
                )}
              </HintRow>
            ))}
          </ol>
        </Card>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Denne oppgaven har ingen hint.
        </p>
      )}

      <DayFooter>
        {props.stats ? (
          <DayStats stats={props.stats} className={dayBoxClasses} />
        ) : null}
        <BestDaily
          frontPage={false}
          todayAnswers={props.todayAnswers}
          className={dayBoxClasses}
        />
      </DayFooter>
    </DayShell>
  );
};
