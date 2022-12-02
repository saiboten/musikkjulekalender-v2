import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Input,
  ListItem,
  Spinner,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { AdminEditLink, DayWithAdmin } from "../pages/p/[id]";
import { PrimaryRed } from "./constants";
import { Difficulty } from "./Difficulty";
import Layout from "./Layout";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";

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
      <Layout whiteBg>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Feilmelding</AlertTitle>
          <AlertDescription>
            Noe gikk galt under henting av hint. Prøv igjen senere.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout whiteBg>
      <AdminEditLink />
      <>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Thumbnail image={props.madeBy} />
        </Box>
        <Heading textAlign="center">
          {format(new Date(props.date), "d 'desember")}
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

        <Text>{props.description}</Text>
        <Spacer multiply={0.5} />

        {isLoading ? <Spinner /> : null}
        <Spacer />

        {solved ? (
          <Text>
            På denne oppgaven høstet du <strong>{points}</strong> poeng!
          </Text>
        ) : (
          <Text>
            Denne oppgaven er nå verdt <strong>{points}</strong> poeng!
          </Text>
        )}
        <Spacer multiply={0.5} />

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
                  placeholder="Hvilken sang skal vi fram til?"
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
      </>

      <Heading size="md">Hint</Heading>
      <Spacer />

      {hints.length < 3 && !solved ? (
        <>
          <Text>Sitter du fast? Du kan få ekstra hint, men det koster!</Text>
          <UnorderedList listStyleType="none" mt="2">
            <ListItem ml="1">1 hint = vi trekker 2 poeng</ListItem>
            <ListItem ml="1">2 hint = vi trekker 3 poeng</ListItem>
            <ListItem ml="1">3 hint = vi trekker 4 poeng</ListItem>
          </UnorderedList>
          <Spacer />
          <Button onClick={hintPlease} disabled={isLoading}>
            Klikk her for å få hint nummer {hints.length + 1}
          </Button>
          <Spacer multiply={0.5} />
        </>
      ) : null}

      {hints.map(({ hint, file }, index) => {
        return (
          <React.Fragment key={index}>
            <Text>
              <Text display="inline" fontWeight="bold">
                Hint {index + 1}
              </Text>
              : {file ? "Lydfil:" : hint}
            </Text>

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
      })}
    </Layout>
  );
};
