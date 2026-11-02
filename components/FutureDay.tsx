"use client";

import { Heading } from "./ui";
import { format, parseISO } from "date-fns";
import Countdown from "react-countdown";
import { AdminEditLink } from "./AdminEditLink";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";
import { countdownRenderer } from "./Countdown";
import { BackLink } from "./BackLink";

interface Props {
  id: number;
  date: string;
}

export const FutureDay = (props: Props) => {
  return (
    <Layout whiteBg>
      <AdminEditLink id={props.id} />
      <BackLink />
      <div className="text-center">
        <Heading>{format(parseISO(props.date), "d 'desember")}</Heading>
        <Spacer />
        <div>
          Tid før luken åpner: <Spacer />
          <Countdown renderer={countdownRenderer} date={parseISO(props.date)} />
        </div>
      </div>
    </Layout>
  );
};
