import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";
import { AdminEditLink, DayWithAdmin } from "../pages/p/[id]";
import { calculatePoints } from "../utils/pointscalculator";
import { PrimaryRed } from "./constants";
import { Difficulty } from "./Difficulty";
import Layout from "./Layout";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";

export const Today: React.FC<DayWithAdmin> = (props) => {
  const [answer, setAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<undefined | string>();
  const [artist, setArtist] = useState<string | undefined>(undefined);
  const [song, setSong] = useState<string | undefined>(undefined);
  const [solutionVideo, setSolutionVideo] = useState<string | undefined>();
  const [solved, setSolved] = useState(props.solved);

  async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAnswer("");
    const res = await (
      await fetch(`/api/answer?guess=${answer.trim()}`)
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

  return (
    <Layout>
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
          <>
            <YoutubeVideo link={props.video}></YoutubeVideo>
            <Spacer />
          </>
        ) : null}
        {/* {props.file ? ( */}
        <Audio controls src={`/api/song/${props.dayId}`}>
          Your browser does not support the
          <code>audio</code> element.
        </Audio>
        {/* ) : null} */}
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
        {props.hint1 ? (
          <>
            <Text>Hint 1: {props.hint1}</Text>
            <Spacer multiply={0.5} />
          </>
        ) : (
          <>
            <Text>
              Det første hintet kommer klokken{" "}
              {format(new Date(props.hint1releaseTime), "hh:mm")}
            </Text>
            <Spacer multiply={0.5} />
          </>
        )}

        {props.hint2 ? (
          <>
            <Text>Hint 2: {props.hint2}</Text>
            <Spacer multiply={0.5} />
          </>
        ) : (
          <>
            <Text>
              Hint nummer 2 kommer klokken{" "}
              {format(new Date(props.hint2releaseTime), "hh:mm")}
            </Text>
            <Spacer multiply={0.5} />
          </>
        )}
        {props.hint3 ? (
          <>
            <Text>Hint 3: {props.hint3}</Text>
            <Spacer multiply={0.5} />
          </>
        ) : (
          <>
            <Text>
              Siste hint kommer klokken{" "}
              {format(new Date(props.hint3releaseTime), "hh:mm")}
            </Text>
            <Spacer multiply={0.5} />
          </>
        )}
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
