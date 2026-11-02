"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format, isBefore, isSameDay, parseISO } from "date-fns";
import { cn } from "./ui";

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

export interface DayWithAdmin extends DayProps {
  solved: boolean;
  now: Date;
  id: number;
  todayAnswers: { points: number; user: string; time: string }[];
}

const doorClasses =
  "relative h-full w-full origin-left bg-white text-[4rem] transition-transform duration-500 [transform-style:preserve-3d] after:absolute after:inset-0 after:-z-1 after:border after:border-solid after:content-['']";

const Post: React.FC<{ day: { id: number; date: string }; today: Date }> = ({
  day,
  today,
}) => {
  const router = useRouter();
  const shouldBeOpen = isBefore(parseISO(day.date), today);
  const isToday = isSameDay(parseISO(day.date), today);

  return (
    <button
      type="button"
      className={cn(
        doorClasses,
        isToday ? "border-[5px] border-solid border-primary" : "border-0",
        shouldBeOpen || isToday
          ? "[transform:perspective(1200px)_rotateY(-40deg)] hover:[transform:perspective(1200px)_rotateY(-50deg)]"
          : "[transform:perspective(1200px)]"
      )}
      onClick={() => router.push(`/p/${day.id}`)}
    >
      {format(new Date(day.date), "d")}
    </button>
  );
};

export default Post;
