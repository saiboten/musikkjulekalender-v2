import React from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { CreateDayForm } from "../components/CreateDayForm";
import { FormData } from "../components/CreateDayForm";
import { getToday } from "../utils/dates";
import { openingHour } from "../components/constants";

const Draft: React.FC = () => {
  const onSubmit = async (data: FormData) => {
    const solutions = data.solutions.map((el) => el.value);
    const { solutions: do_not_use, date, ...rest } = data;
    date.setHours(openingHour);

    try {
      const body = { ...rest, solutions, date };

      await fetch(`/api/day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const session = useSession();

  if (session.data?.user.role !== "admin") {
    return null;
  }

  const standardDate = getToday();

  return (
    <CreateDayForm
      hasHints
      artist=""
      date={standardDate.toISOString()}
      id={1}
      isDayPassed={false}
      isToday={false}
      solution={[]}
      song=""
      onSubmit={onSubmit}
    />
  );
};

export default Draft;
