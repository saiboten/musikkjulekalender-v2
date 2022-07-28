import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

// id             Int        @id @default(autoincrement())
//   difficulty     Int?
//   points         Int?
//   image          String?
//   description    String?
//   solutionVideo  String?
//   solutionDate   DateTime
//   revealDate     DateTime
//   solutionArtist String
//   solutionSong   String
//   Solution       Solution[]

export type DayProps = {
  id: number;
  difficulty?: number;
  points?: number;
  image?: string;
  description?: string;
  solutionVideo?: string;
  date: Date;
  solutionArtist: string;
  solutionSong: string;
  // Solution       Solution[]
};

const Post: React.FC<{ day: DayProps }> = ({ day }) => {
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${day.id}`)}>
      <h2>{day.description}</h2>
      {day.solutionSong}
      {/* <ReactMarkdown>{day.}</ReactMarkdown> */}
    </div>
  );
};

export default Post;
