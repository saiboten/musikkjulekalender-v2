"use client";

import {
  Alert,
  Button,
  Heading,
  Input,
  List,
  ListItem,
  Spinner,
  useToast,
} from "./ui";
import Markdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { DayWithAdmin } from "./Day";
import { AdminEditLink } from "./AdminEditLink";
import Layout from "./Layout";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";
import { BackLink } from "./BackLink";
import { BestDaily } from "./BestDaily";

interface HintAndFile {
  hint: string;
  file: boolean;
}

export const Today: React.FC<DayWithAdmin> = (props) => {
  const [answer, setAnswer] = useState("");

  const [hints, setHints] = useState<HintAndFile[]>(
    [
      { hint: props.hint1, file: props.hasFileHint1 },
      { hint: props.hint2, file: props.hasFileHint2 },
      { hint: props.hint3, file: props.hasFileHint3 },
    ].filter((el) => el.hint !== null)
  );

  const [points, setPoints] = useState(props.points);
  const solved = props.solved;
  const toast = useToast();

  const { isPending, isError, mutate } = useMutation({
    mutationFn: async () => {
      return await (await fetch(`/api/gethint?dayId=${props.id}`)).json();
    },
    onSuccess: (data) => {
      if (data.hint || data.fileHintExists) {
        setHints([...hints, { hint: data.hint, file: data.fileHintExists }]);
        setPoints(data.points);
      } else {
      }
    },
  });

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

  function hintPlease() {
    mutate();
  }

  if (isError) {
    return (
      <Layout whiteBg>
        <Alert status="error" icon title="Feilmelding">
          Noe gikk galt under henting av hint. Prøv igjen senere.
        </Alert>
      </Layout>
    );
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

        {isPending ? <Spinner /> : null}
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

      {props.hasHints && hints?.length < 3 && !solved ? (
        <>
          <p>Sitter du fast? Du kan få ekstra hint, men det koster!</p>
          <List className="mt-2 ms-4">
            <ListItem className="ml-1">1 hint = vi trekker 2 poeng</ListItem>
            <ListItem className="ml-1">2 hint = vi trekker 3 poeng</ListItem>
            <ListItem className="ml-1">3 hint = vi trekker 4 poeng</ListItem>
          </List>
          <Spacer />
          <Button onClick={hintPlease} disabled={isPending}>
            Klikk her for å få hint nummer {hints.length + 1}
          </Button>
          <Spacer multiply={0.5} />
        </>
      ) : null}

      {props.hasHints
        ? hints.map(({ hint, file }, index) => {
            return (
              <React.Fragment key={index}>
                <p>
                  <span className="font-bold">Hint {index + 1}</span>:{" "}
                  {file ? "Lydfil:" : hint}
                </p>

                {file ? (
                  <Audio
                    controls
                    preload="none"
                    src={`/api/hint/${props.id}/${index + 1}`}
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
      <p>Denne dagen klarte {props.todayAnswers.length} personer oppgaven.</p>
      <Spacer />
      <BestDaily frontPage={false} todayAnswers={props.todayAnswers} />
    </Layout>
  );
};
