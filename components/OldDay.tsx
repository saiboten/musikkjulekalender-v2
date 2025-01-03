import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { AdminEditLink, DayWithAdmin } from "../pages/p/[id]";
import Layout from "./Layout";
import Markdown from "react-markdown";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";
import Link from "next/link";
import { Hint } from "./Hint";
import { BestDaily } from "./BestDaily";

export const OldDay: React.FC<DayWithAdmin> = (props) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Layout whiteBg>
      <AdminEditLink />
      <Link href="/">
        <Button>Tilbake</Button>
      </Link>
      <Spacer />
      <Box textAlign="center">
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Thumbnail image={props.madeBy} />
        </Box>

        <Heading>{format(parseISO(props.date), "d 'desember")}</Heading>
        <Spacer multiply={0.5} />
        {props.video ? (
          <YoutubeVideo link={props.video}></YoutubeVideo>
        ) : props.hasTextSolution ? null : (
          <Audio controls preload="none" src={`/api/song/${props.id}`}>
            Your browser does not support the
            <code>audio</code> element.
          </Audio>
        )}

        <Spacer multiply={0.5} />
        <Box textAlign="left" maxWidth="30rem" m="0 auto">
          <Markdown>{props.description}</Markdown>

          <Spacer multiply={0.5} />
          {props.hasHints ? (
            <>
              <Hint
                hint={props.hint1}
                hintNumber={1}
                id={props.id}
                fileHintExists={props.hasFileHint1}
              />

              <Spacer multiply={0.5} />
              <Hint
                hint={props.hint2}
                hintNumber={2}
                id={props.id}
                fileHintExists={props.hasFileHint2}
              />

              <Spacer multiply={0.5} />
              <Hint
                hint={props.hint3}
                hintNumber={3}
                id={props.id}
                fileHintExists={props.hasFileHint3}
              />
            </>
          ) : null}

          <Spacer multiply={0.5} />
          {showSolution ? null : (
            <Button onClick={() => setShowSolution(true)}>Vis fasit</Button>
          )}
          {showSolution ? (
            <>
              <Heading>Fasit</Heading>

              <Text textAlign="center" fontWeight="bold" fontSize="22px">
                {props.artist} - {props.song}
              </Text>
              {props.solutionDescription ? (
                <>
                  {props.solutionDescription}
                  <Spacer />
                </>
              ) : null}
              <YoutubeVideo link={props.solutionVideo} />
            </>
          ) : null}
          <Spacer multiply={1} />
        </Box>
      </Box>
      <Text>
        Denne dagen klarte {props.todayAnswers.length} personer oppgaven.
      </Text>
      <Spacer />
      <BestDaily frontPage={false} todayAnswers={props.todayAnswers} />
    </Layout>
  );
};
