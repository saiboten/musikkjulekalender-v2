import React from "react";
import Router from "next/router";
import { format, isBefore, isEqual, isSameDay, parseISO } from "date-fns";
import styled from "styled-components";
import { PrimaryRed } from "./constants";
import { getToday } from "../utils/dates";

export type DayProps = {
  id: number;
  difficulty?: number;
  points?: number;
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
  file?: {
    id: number;
    dayId: number;
    file: string;
  };
  hint1?: string;
  hint2?: string;
  hint3?: string;
};

const Button = styled.button<{ today: boolean; shouldBeOpen: boolean }>`
  font-size: 4rem;
  background-color: inherit;
  width: 100%;
  height: 100%;
  border: ${(props) => (props.today ? `5px solid ${PrimaryRed}` : "0")};
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(2500px)
    ${(props) => (props.shouldBeOpen ? "rotateY(-25deg)" : "")};
  transform-origin: left;
  background-color: white;

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

const Post: React.FC<{ day: DayProps; today: Date }> = ({ day, today }) => {
  const shouldBeOpen = isBefore(parseISO(day.date), today);
  const isToday = isEqual(parseISO(day.date), today);
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
