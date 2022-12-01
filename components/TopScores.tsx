import { Button, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
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

  let tmpScore = Number.MAX_SAFE_INTEGER;
  let pos = 0;

  var fixedScores = scoresAboveZero
    .filter((user, index) => index < 5 || showAll)
    .map((user, index) => {
      if (user.score < tmpScore) {
        pos = index;
        tmpScore = user.score;
        return {
          ...user,
          pos: pos + 1,
        };
      }
      return {
        ...user,
        pos: index + 1,
      };
    });

  return (
    <FrontPageBox>
      <Heading size="md">Toppscorelisten</Heading>
      <Spacer />
      {fixedScores.map((el, index) => {
        return (
          <div key={index}>
            <Text
              display="inline"
              fontWeight={el.id === session.data.id ? "bold" : "normal"}
            >
              {el.pos}: {el.name}:{" "}
            </Text>
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
