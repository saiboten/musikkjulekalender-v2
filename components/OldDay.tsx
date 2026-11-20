"use client";

import { useState } from "react";
import { Button } from "./ui";
import { DayWithAdmin } from "./Day";
import { Hint } from "./Hint";
import { BestDaily } from "./BestDaily";
import { DayStats } from "./DayStats";
import {
  Card,
  DayFooter,
  DayShell,
  DayTask,
  SongList,
  dayBoxClasses,
} from "./DayLayout";

export const OldDay: React.FC<DayWithAdmin> = (props) => {
  const [showSolution, setShowSolution] = useState(false);
  const dual = !!props.dualAnswer;
  const songs = [
    { part: 1, artist: props.artist, song: props.song },
    ...(dual ? [{ part: 2, artist: props.artist2, song: props.song2 }] : []),
  ];

  return (
    <DayShell id={props.id} date={props.date} madeBy={props.madeBy}>
      <DayTask
        id={props.id}
        video={props.video}
        hasTextSolution={props.hasTextSolution}
        description={props.description}
      />

      {props.hasHints ? (
        <Card title="Hint">
          <ol className="space-y-4">
            {([1, 2, 3] as const).map((n) =>
              props.hintExists?.[n - 1] ? (
                <Hint
                  key={n}
                  hint={props[`hint${n}`] ?? ""}
                  hintNumber={n}
                  id={props.id}
                  fileHintExists={props[`hasFileHint${n}`]}
                />
              ) : null
            )}
          </ol>
        </Card>
      ) : null}

      {showSolution ? (
        <Card tone="success" title="Fasit">
          <SongList songs={songs} numbered={dual} />
          {props.solutionDescription ? (
            <p className="mt-3 text-gray-700">{props.solutionDescription}</p>
          ) : null}
        </Card>
      ) : (
        <div className="text-center">
          <Button
            className="bg-primary text-white hover:bg-[#741111] active:bg-[#5c0d0d]"
            onClick={() => setShowSolution(true)}
          >
            Vis fasit
          </Button>
        </div>
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
