import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { AdminEditLink, DayWithAdmin } from "../pages/p/[id]";
import { calculatePoints } from "../utils/pointscalculator";
import { PrimaryRed } from "./constants";
import { countdownRenderer } from "./Countdown";
import { Difficulty } from "./Difficulty";
import Layout from "./Layout";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";

export const Today: React.FC<DayWithAdmin> = (props) => {
  const [answer, setAnswer] = useState("");

  const [hints, setHints] = useState<string[]>(
    [props.hint1, props.hint2, props.hint3].filter((el) => el !== null)
  );

  const [answerFeedback, setAnswerFeedback] = useState<undefined | string>();
  const [artist, setArtist] = useState<string | undefined>(undefined);
  const [song, setSong] = useState<string | undefined>(undefined);
  const [solutionVideo, setSolutionVideo] = useState<string | undefined>();
  const [solved, setSolved] = useState(props.solved);

  const { isLoading, isError, mutate } = useMutation({
    mutationFn: async () => {
      return await (await fetch(`/api/gethint?dayId=${props.id}`)).json();
    },
    onSuccess: (data) => {
      if (data.hint) {
        setHints([...hints, data.hint]);
      } else {
        console.log("no hinty?!");
      }
    },
  });
  async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAnswer("");
    const res = await (
      await fetch(`/api/answer?guess=${answer.trim()}&dayId=${props.id}`)
    ).json();
    setAnswerFeedback(
      res.success ? "Riktig" : "Det var dessverre feil, prøv igjen!"
    );

    if (res.success) {
      setArtist(res.artist);
      setSong(res.song);
      setSolutionVideo(res.solutionVideo);
      setSolved(true);
    }
  }

  function hintPlease() {
    mutate();
  }

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Noe gikk galt under henting av hint</AlertTitle>
        <AlertDescription>
          Your Chakra experience may be degraded.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Layout whiteBg>
      <AdminEditLink />
      <div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Difficulty difficulty={props.difficulty ?? 1} />
          <Thumbnail image={props.madeBy} />
        </Box>
        <Heading textAlign="center">
          {format(new Date(props.date), "d 'dag jul")}
        </Heading>
        <Spacer multiply={0.5} />
        {props.video ? (
          <YoutubeVideo link={props.video}></YoutubeVideo>
        ) : (
          <Audio controls preload="none" src={`/api/song/${props.id}`}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        )}
        <Spacer multiply={0.5} />
        <Text>
          Verdi:{" "}
          {props.points ??
            calculatePoints(new Date(props.now), new Date(props.date))}{" "}
          poeng!
        </Text>
        <Spacer multiply={0.5} />
        <Text>{props.description}</Text>
        <Spacer multiply={0.5} />
        <Heading size="md">Hint</Heading>
        <Spacer />
        {hints.map((el, index) => {
          return (
            <>
              <Text>
                Hint {index + 1}: {el}
              </Text>
              <Spacer multiply={0.5} />
            </>
          );
        })}
        {isLoading ? <Spinner /> : null}
        {hints.length < 3 ? (
          <>
            <Button onClick={hintPlease} disabled={isLoading}>
              Klikk her for å få et nytt hint
            </Button>
            <Text>Noe med hvor mange poeng man mister?</Text>
            <Spacer multiply={0.5} />
          </>
        ) : null}

        {solved ? (
          <>
            {answerFeedback ? <Text>{answerFeedback}</Text> : null}
            <Spacer />
            <Heading size="lg">Fasit:</Heading>
            <Spacer />
            <Text>
              {artist ?? props.artist} - {song ?? props.song}
            </Text>
            <Spacer />
            <YoutubeVideo link={solutionVideo ?? props.solutionVideo} />
          </>
        ) : (
          <>
            <Heading size="md">Svar</Heading>
            <Spacer />
            <form onSubmit={handleAnswer}>
              <Box display="flex">
                <Input
                  placeholder="Legg inn ditt svar her"
                  name="svar"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  mr="10px"
                ></Input>
                <Button type="submit" disabled={answer === ""}>
                  Gjett
                </Button>
              </Box>
            </form>
            <Spacer multiply={0.5} />
            {answerFeedback ? (
              <Text p="3" borderRadius="5" border={`1px solid ${PrimaryRed}`}>
                {answerFeedback}
              </Text>
            ) : null}
          </>
        )}
      </div>
    </Layout>
  );
};
