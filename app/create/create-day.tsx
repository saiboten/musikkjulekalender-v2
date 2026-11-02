"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CreateDayForm, FormData } from "../../components/CreateDayForm";
import { openingHour } from "../../components/constants";

export function CreateDay({ standardDate }: { standardDate: string }) {
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const solutions = data.solutions.map((el) => el.value);
    const { solutions: _solutions, date, ...rest } = data;
    date.setHours(openingHour);

    try {
      const body = { ...rest, solutions, date };

      await fetch(`/api/day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CreateDayForm
      hasHints
      artist=""
      date={standardDate}
      id={1}
      isDayPassed={false}
      isToday={false}
      solution={[]}
      song=""
      onSubmit={onSubmit}
    />
  );
}
