import { Heading, List, ListItem } from "@chakra-ui/react";
import { FrontPageBox } from "./FrontPageBox";
import { Spacer } from "./lib/Spacer";

interface Props {
  todayAnswers: { points: number; user: string }[];
}

export const BestDaily = ({ todayAnswers }: Props) => {
  return (
    <FrontPageBox>
      <Heading size="md">Dagens beste</Heading>
      <Spacer />
      <List>
        {todayAnswers.map((el) => {
          return (
            <ListItem key={el.user}>
              {el.user}: {el.points}
            </ListItem>
          );
        })}
      </List>
    </FrontPageBox>
  );
};
