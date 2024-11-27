import React from "react";
import Router from "next/router";
import { format, isBefore, isSameDay, parseISO } from "date-fns";
import styled from "styled-components";
import { PrimaryRed } from "./constants";

export type DayProps = {
  id: number;
  hasTextSolution?: boolean;
  difficulty?: number;
  points?: number;
  hasHints: boolean;
  description?: string;
  video?: string;
  date: string;
  artist: string;
  song: string;
  solution: { solution: string; id: string; dayId: string }[];
  madeBy?: string;
  isToday: boolean;
  isDayPassed: boolean;
  solutionVideo?: string;
  solutionDescription?: string;
  file?: {
    id: number;
    dayId: number;
    file: string;
    hint1file?: string;
    hint2file?: string;
    hint3file?: string;
  };
  hint1?: string;
  hint2?: string;
  hint3?: string;
  hasFileHint1?: boolean;
  hasFileHint2?: boolean;
  hasFileHint3?: boolean;
};

const Button = styled.button<{ today: boolean; shouldBeOpen: boolean }>`
  transition: transform 0.5s;
  font-size: 4rem;
  background-color: inherit;
  width: 100%;
  height: 100%;
  border: ${(props) => (props.today ? `5px solid ${PrimaryRed}` : "0")};
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1200px)
    ${(props) => (props.shouldBeOpen ? "rotateY(-40deg)" : "")};
  transform-origin: left;
  background-color: white;

  &:hover {
    transform: perspective(1200px)
      ${(props) => (props.shouldBeOpen ? "rotateY(-50deg)" : "")};
  }

  &:after {
    content: "";
    border: 1px solid;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
`;

const Post: React.FC<{ day: { id: number; date: string }; today: Date }> = ({
  day,
  today,
}) => {
  const shouldBeOpen = isBefore(parseISO(day.date), today);
  const isToday = isSameDay(parseISO(day.date), today);

  return (
    <Button
      shouldBeOpen={shouldBeOpen || isToday}
      today={isToday}
      onClick={() => Router.push("/p/[id]", `/p/${day.id}`)}
    >
      {format(new Date(day.date), "d")}
    </Button>
  );
};

export default Post;
