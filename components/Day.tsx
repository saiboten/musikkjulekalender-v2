import React from "react";
import Router from "next/router";
import { format } from "date-fns";
import styled from "styled-components";

export type DayProps = {
  id: number;
  difficulty?: number;
  points?: number;
  description?: string;
  video?: string;
  date: Date;
  artist: string;
  song: string;
  solutions: string[];
  isToday: boolean;
};

const Button = styled.button`
  font-size: 4rem;
  background-color: inherit;
  width: 100%;
  height: 100%;
`;

const Post: React.FC<{ day: DayProps }> = ({ day }) => {
  return (
    <Button onClick={() => Router.push("/p/[id]", `/p/${day.id}`)}>
      {format(new Date(day.date), "d")}
    </Button>
  );
};

export default Post;
