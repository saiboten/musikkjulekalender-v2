"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format, isBefore, isSameDay, parseISO } from "date-fns";
import { cn } from "./ui";
import type { DayStats } from "../utils/dayStats";

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
  solution: { solution: string; id: string; dayId: string; part?: number }[];
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
  /** Today only: how many hints are open right now (0–3). */
  openHints?: number;
  /** Today only: ISO times when hint 1, 2 and 3 open. */
  hintOpenTimes?: string[];
  /** Today only: whether hint 1, 2 and 3 exist for this day. */
  hintExists?: boolean[];
  /** Two songs to find, each scored on its own. */
  dualAnswer?: boolean;
  artist2?: string;
  song2?: string;
  /** Which songs (1, 2) the player has found. */
  foundParts?: number[];
  /** Points the player has earned on this day so far. */
  earnedPoints?: number;
  /** Today and passed days: statistics for the day. */
  stats?: DayStats;
};

export interface DayWithAdmin extends DayProps {
  solved: boolean;
  now: Date;
  id: number;
  todayAnswers: {
    points: number;
    user: string;
    time: string;
    found?: number;
    parts?: number;
  }[];
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
