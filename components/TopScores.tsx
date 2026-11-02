"use client";

import { Button, Heading } from "./ui";
import { useSession } from "./session";
import { useState } from "react";
import { Spacer } from "./lib/Spacer";
import { NumberAnimation } from "./lib/NumberAnimation";
import { FrontPageBox } from "./FrontPageBox";

export const TopScores = ({
  scores,
}: {
  scores: { id: number; name: string; score: number }[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const session = useSession();
  const scoresAboveZero = scores.filter((user) => user.score > -1);

  const fixedScores = scoresAboveZero
    .filter((user, index) => index < 5 || showAll)
    .map((user, index) => ({
      ...user,
      pos: index + 1,
    }));

  return (
    <FrontPageBox>
      <Heading size="md">Toppscorelisten</Heading>
      <Spacer />
      {fixedScores.map((el, index) => {
        return (
          <div key={index}>
            <span
              className={
                el.id === session.data?.id ? "font-bold" : "font-normal"
              }
            >
              {el.pos}: {el.name}:{" "}
            </span>
            <strong>
              <NumberAnimation>{el.score}</NumberAnimation>
            </strong>
          </div>
        );
      })}
      <Spacer />
      {!showAll ? (
        <Button onClick={() => setShowAll(true)}>Vis alle</Button>
      ) : null}
    </FrontPageBox>
  );
};
