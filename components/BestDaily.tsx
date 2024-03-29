import { Heading, List, ListItem, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { FrontPageBox } from "./FrontPageBox";
import { Spacer } from "./lib/Spacer";

interface Props {
  todayAnswers: { points: number; user: string; time: string }[];
}

export const BestDaily = ({ todayAnswers }: Props) => {
  return (
    <FrontPageBox>
      <Heading size="md">Dagens beste</Heading>
      <Spacer />
      {todayAnswers.length > 0 ? (
        <List>
          {todayAnswers.map((el) => {
            return (
              <ListItem key={el.user}>
                {el.user} @ {format(parseISO(el.time), "HH:mm:ss")} -{" "}
                {el.points} poeng
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Text>-</Text>
      )}
    </FrontPageBox>
  );
};
