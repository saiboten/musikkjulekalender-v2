import React from "react";
import Router from "next/router";
import { format, isSameDay } from "date-fns";
import styled from "styled-components";
import { PrimaryRed } from "./constants";
import { getToday } from "../utils/dates";

export type DayProps = {
  id: number;
  difficulty?: number;
  points?: number;
  description?: string;
  video?: string;
  date: Date;
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

const Button = styled.button<{ today: boolean }>`
  font-size: 4rem;
  background-color: inherit;
  width: 100%;
  height: 100%;
  border: ${(props) => (props.today ? `5px solid ${PrimaryRed}` : "0")};
`;

const Post: React.FC<{ day: DayProps; today: Date }> = ({ day, today }) => {
  return (
    <Button
      today={day.date == today}
      onClick={() => Router.push("/p/[id]", `/p/${day.id}`)}
    >
      {format(new Date(day.date), "d")}
    </Button>
  );
};

export default Post;
