"use client";

import { parseISO } from "date-fns";
import Countdown from "react-countdown";
import { countdownRenderer } from "./Countdown";
import { Card, DayShell } from "./DayLayout";

interface Props {
  id: number;
  date: string;
}

export const FutureDay = (props: Props) => {
  return (
    <DayShell id={props.id} date={props.date}>
      <Card className="text-center">
        <p className="mb-2 text-gray-600">Tid før luken åpner:</p>
        <Countdown renderer={countdownRenderer} date={parseISO(props.date)} />
      </Card>
    </DayShell>
  );
};
