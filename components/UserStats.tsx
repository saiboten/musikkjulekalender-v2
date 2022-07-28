import { Box, Heading } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";

interface Props {
  userScores: {
    day: string;
    score: number;
  }[];
}

export function UserStats({ userScores }: Props) {
  console.log(userScores);
  return (
    <Box>
      <Heading size="lg">Dine resultater</Heading>
      {userScores.map((el) => (
        <li key={el.day}>
          {format(new Date(el.day), "d ' desember")}: {el.score}
        </li>
      ))}
    </Box>
  );
}
