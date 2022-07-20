import { Box, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Spacer } from "./lib/Spacer";
import { NumberAnimation } from "./lib/NumberAnimation";

export const TopScores = ({
  scores,
}: {
  scores: { name: string; score: number }[];
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
    <Box
      backgroundColor="#fff"
      padding="2"
      margin="10px 0px"
      borderRadius="5px"
      boxShadow="rgb(0 0 0 / 50%) 1px 2px 4px 0px"
    >
      <Heading size="lg">Toppscorelisten</Heading>
      <Spacer />
      {fixedScores.map((el, index) => {
        return (
          <div key={index}>
            <Text
              display="inline"
              fontWeight={
                el.name === session.data.user.email.split("@")[0]
                  ? "bold"
                  : "normal"
              }
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
    </Box>
  );
};
