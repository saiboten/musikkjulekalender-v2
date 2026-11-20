import { Heading, List, ListItem } from "./ui";
import { format, parseISO } from "date-fns";
import { FrontPageBox } from "./FrontPageBox";
import { Spacer } from "./lib/Spacer";

interface Props {
  todayAnswers: {
    points: number;
    user: string;
    time: string;
    /** Correct answers, out of `parts` things to find on the day. */
    found?: number;
    parts?: number;
  }[];
  frontPage: boolean;
  className?: string;
}

export const BestDaily = ({ frontPage, todayAnswers, className }: Props) => {
  return (
    <FrontPageBox className={className}>
      <Heading size="md">
        {frontPage ? "Dagens beste" : "Disse har klart oppgaven"}
      </Heading>
      <Spacer />
      {todayAnswers.length > 0 ? (
        <List>
          {todayAnswers.map((el) => {
            return (
              <ListItem key={el.user}>
                {el.user} @ {format(parseISO(el.time), "HH:mm:ss")} -{" "}
                {el.points} poeng
                {el.parts && el.parts > 1 && (el.found ?? 0) < el.parts
                  ? ` (${el.found}/${el.parts} riktige)`
                  : null}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <p>-</p>
      )}
    </FrontPageBox>
  );
};
