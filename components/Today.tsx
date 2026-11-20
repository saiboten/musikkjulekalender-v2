"use client";

import { Button, Input, cn, useToast } from "./ui";
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

export const Today: React.FC<DayWithAdmin> = (props) => {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  const points = props.points;
  const solved = props.solved;
  const toast = useToast();
  const openHints = props.openHints ?? 0;
  const hintOpenTimes = props.hintOpenTimes ?? [];
  const dual = !!props.dualAnswer;
  const foundParts = props.foundParts ?? [];
  const songs = [
    { part: 1, artist: props.artist, song: props.song },
    ...(dual ? [{ part: 2, artist: props.artist2, song: props.song2 }] : []),
  ];

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

  async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAnswer("");
    const params = new URLSearchParams({
      guess: answer.trim(),
      dayId: String(props.id),
    });
    const res = await (await fetch(`/api/answer?${params}`)).json();

    if (res.alreadyFound) {
      toast({
        title: "Allerede funnet",
        description: "Den sangen har du allerede funnet. Finn den andre!",
        status: "info",
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: res.success ? "Riktig" : "Galt",
      description: !res.success
        ? "Det var dessverre feil, prøv igjen!"
        : !dual
          ? "Du klarte oppgaven!"
          : res.done
            ? "Du fant begge sangene!"
            : "Du fant én av sangene – én igjen!",
      status: res.success ? "success" : "error",
      duration: 6000,
      isClosable: true,
    });

    if (res.done) {
      window.location.reload();
    } else if (res.success) {
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
              {dual
                ? `${points} poeng per sang nå`
                : `Verdt ${points} poeng nå`}
            </Pill>
          }
        >
          {dual ? (
            <div className="mb-4 space-y-3">
              <p className="text-gray-700">
                Denne dagen skjuler <strong>to sanger</strong>. Hver sang gir
                poeng for seg, og du gjetter begge i samme felt.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {songs.map(({ part, artist, song }) => {
                  const found = foundParts.includes(part);
                  return (
                    <li
                      key={part}
                      className={cn(
                        "rounded-lg border px-3 py-2",
                        found
                          ? "border-green-200 bg-green-50 text-green-900"
                          : "border-dashed border-gray-300 text-gray-500"
                      )}
                    >
                      <span className="block text-xs font-semibold tracking-wide uppercase">
                        {found ? "✓ " : ""}Sang {part}
                      </span>
                      <span className="font-medium">
                        {found ? `${artist} – ${song}` : "Ikke funnet ennå"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {foundParts.length > 0 ? (
                <p className="text-sm text-gray-700">
                  Du har <strong>{props.earnedPoints ?? 0}</strong> poeng så
                  langt.
                </p>
              ) : null}
            </div>
          ) : null}

          <form onSubmit={handleAnswer} className="flex gap-2">
            <Input
              placeholder={
                props.hasTextSolution
                  ? "Skriv ditt svar her"
                  : "Hvilken sang skal vi fram til?"
              }
              aria-label="Ditt svar"
              name="svar"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="h-11 text-base"
            />
            <Button
              type="submit"
              disabled={answer === ""}
              className="h-11 bg-primary text-white hover:bg-[#741111] active:bg-[#5c0d0d] disabled:hover:bg-primary"
            >
              Gjett
            </Button>
          </form>

          <div className="mt-5">
            <p className="mb-2 text-sm text-gray-600">
              Jo tidligere du svarer, jo flere poeng{dual ? " per sang" : ""}:
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
                    {hint ? <p>{hint}</p> : null}
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
