import { Heading, List, ListItem } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { FrontPageBox } from "./FrontPageBox";
import { Spacer } from "./lib/Spacer";

interface Props {
  userScores: {
    day: string;
    score: number;
  }[];
}

export function UserStats({ userScores }: Props) {
  return (
    <FrontPageBox>
      <Heading size="md">Dine resultater</Heading>
      <Spacer />
      <List>
        {userScores.map((el) => (
          <ListItem key={el.day}>
            {format(new Date(el.day), "d ' desember")}: {el.score} poeng
          </ListItem>
        ))}
      </List>
    </FrontPageBox>
  );
}
