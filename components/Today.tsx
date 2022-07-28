import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import { AdminEditLink, DayWithAdmin } from "../pages/p/[id]";
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

  async function handleAnswer() {
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
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer multiply={0.5} />
        {props.video ? <YoutubeVideo link={props.video}></YoutubeVideo> : null}
        {props.file ? (
          <Audio controls src={props.file}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        ) : null}
        <Spacer multiply={0.5} />
        <Text>{props.description}</Text>
        <Spacer />
        {solved ? (
          <>
            {answerFeedback ? <Text>answerFeedback</Text> : null}
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
            <Box display="flex">
              <Input
                placeholder="Legg inn ditt svar her"
                name="svar"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                mr="10px"
              ></Input>
              <Button disabled={answer === ""} onClick={handleAnswer}>
                Gjett
              </Button>
            </Box>
            <Spacer multiply={0.5} />
            <Text p="3" borderRadius="5" border={`1px solid ${PrimaryRed}`}>
              {answerFeedback}
            </Text>
          </>
        )}
      </div>
    </Layout>
  );
};
