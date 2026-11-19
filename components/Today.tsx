"use client";

import { Button, Heading, Input, List, ListItem, useToast } from "./ui";
import Markdown from "react-markdown";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DayWithAdmin } from "./Day";
import { AdminEditLink } from "./AdminEditLink";
import Layout from "./Layout";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";
import { BackLink } from "./BackLink";
import { BestDaily } from "./BestDaily";
import { DayStats } from "./DayStats";

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
    { label: `Før kl. ${formatTime(hintOpenTimes[0])}`, points: 5 },
    {
      label: `${formatTime(hintOpenTimes[0])}–${formatTime(hintOpenTimes[1])}`,
      points: 3,
    },
    {
      label: `${formatTime(hintOpenTimes[1])}–${formatTime(hintOpenTimes[2])}`,
      points: 2,
    },
    { label: `Etter kl. ${formatTime(hintOpenTimes[2])}`, points: 1 },
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
    const res = await (
      await fetch(`/api/answer?guess=${answer.trim()}&dayId=${props.id}`)
    ).json();
    toast({
      title: res.success ? "Riktig" : "Galt",
      description: res.success
        ? "Du klarte oppgaven!"
        : "Det var dessverre feil, prøv igjen!",
      status: res.success ? "success" : "error",
      duration: 6000,
      isClosable: true,
    });

    if (res.success) {
      // setArtist(res.artist);
      // setSong(res.song);
      // setSolutionVideo(res.solutionVideo);
      // setSolved(true);
      // setHints(res.hints);
      window.location.reload();
    }
  }

  return (
    <Layout whiteBg>
      <AdminEditLink id={props.id} />
      <BackLink />
      <Spacer />
      <>
        <div className="flex items-center justify-end">
          <Thumbnail image={props.madeBy} />
        </div>
        <Heading className="text-center">
          {format(new Date(props.date), "d 'desember")}
        </Heading>
        <Spacer multiply={0.5} />
        {props.video ? <YoutubeVideo link={props.video}></YoutubeVideo> : null}

        {props.hasTextSolution ? null : (
          <Audio controls preload="none" src={`/api/song/${props.id}`}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        )}
        <Spacer multiply={0.5} />

        <Markdown>{props.description}</Markdown>
        <Spacer multiply={0.5} />

        <Spacer />

        {solved ? (
          <p>
            På denne oppgaven høstet du <strong>{points}</strong> poeng!
          </p>
        ) : (
          <p>
            Denne oppgaven er nå verdt <strong>{points}</strong> poeng!
          </p>
        )}
        <Spacer multiply={0.5} />

        {!solved ? (
          <>
            <p>Jo tidligere du svarer, jo flere poeng får du:</p>
            <List className="mt-2 ms-4">
              {pointSteps.map(({ label, points: stepPoints }) => (
                <ListItem key={label} className="ml-1">
                  {label}: {stepPoints} poeng
                </ListItem>
              ))}
            </List>
            <Spacer />
          </>
        ) : null}

        {solved ? (
          <>
            <Spacer />
            <Heading size="lg">Fasit:</Heading>
            <Spacer />
            <p>
              {props.artist} - {props.song}
            </p>
            <Spacer />
            {props.solutionDescription ? (
              <>
                {props.solutionDescription}
                <Spacer />
              </>
            ) : null}
          </>
        ) : (
          <>
            <Heading size="md">Svar</Heading>
            <Spacer />
            <form onSubmit={handleAnswer}>
              <div className="flex">
                <Input
                  placeholder={
                    props.hasTextSolution
                      ? "Skriv ditt svar her"
                      : "Hvilken sang skal vi fram til?"
                  }
                  name="svar"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mr-2.5"
                />
                <Button type="submit" disabled={answer === ""}>
                  Gjett
                </Button>
              </div>
            </form>
            <Spacer multiply={0.5} />
          </>
        )}
      </>

      {props.hasHints ? (
        <>
          <Spacer />
          <Heading size="md">Hint</Heading>
          <Spacer />
        </>
      ) : (
        <p>Denne oppgaven har ingen hint.</p>
      )}

      {props.hasHints
        ? hints.map(({ number, hint, file, isOpen, openTime }) => {
            if (!isOpen) {
              return (
                <React.Fragment key={number}>
                  <p>
                    <span className="font-bold">Hint {number}</span>: åpner kl.{" "}
                    {formatTime(openTime)}
                  </p>
                  <Spacer multiply={0.5} />
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={number}>
                <p>
                  <span className="font-bold">Hint {number}</span>:{" "}
                  {file ? "Lydfil:" : hint}
                </p>

                {file ? (
                  <Audio
                    controls
                    preload="none"
                    src={`/api/hint/${props.id}/${number}`}
                  >
                    Your browser does not support the
                    <code>audio</code> element.
                  </Audio>
                ) : null}
                <Spacer multiply={0.5} />
              </React.Fragment>
            );
          })
        : null}
      {props.stats ? <DayStats stats={props.stats} /> : null}
      <Spacer />
      <BestDaily frontPage={false} todayAnswers={props.todayAnswers} />
    </Layout>
  );
};
