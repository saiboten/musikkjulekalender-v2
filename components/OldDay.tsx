"use client";

import { Button, Heading } from "./ui";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { DayWithAdmin } from "./Day";
import { AdminEditLink } from "./AdminEditLink";
import Layout from "./Layout";
import Markdown from "react-markdown";
import { Audio } from "./lib/Audio";
import { Spacer } from "./lib/Spacer";
import { YoutubeVideo } from "./lib/YoutubeVideo";
import { Thumbnail } from "./Thumbnail";
import { BackLink } from "./BackLink";
import { Hint } from "./Hint";
import { BestDaily } from "./BestDaily";

export const OldDay: React.FC<DayWithAdmin> = (props) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Layout whiteBg>
      <AdminEditLink id={props.id} />
      <BackLink />
      <Spacer />
      <div className="text-center">
        <div className="flex items-center justify-end">
          <Thumbnail image={props.madeBy} />
        </div>

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
        <div className="mx-auto max-w-[30rem] text-left">
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

              <p className="text-center text-[22px] font-bold">
                {props.artist} - {props.song}
              </p>
              {props.solutionDescription ? (
                <>
                  {props.solutionDescription}
                  <Spacer />
                </>
              ) : null}
            </>
          ) : null}
          <Spacer multiply={1} />
        </div>
      </div>
      <p>Denne dagen klarte {props.todayAnswers.length} personer oppgaven.</p>
      <Spacer />
      <BestDaily frontPage={false} todayAnswers={props.todayAnswers} />
    </Layout>
  );
};
