import { Heading, List, ListItem } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
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
        {userScores.map((el, index) => (
          <ListItem key={index}>
            {format(parseISO(el.day), "d. MMMM", { locale: nb })}: {el.score}{" "}
            poeng
          </ListItem>
        ))}
      </List>
    </FrontPageBox>
  );
}
