"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DayProps } from "../../../components/Day";
import { CreateDayForm, FormData } from "../../../components/CreateDayForm";
import { openingHour } from "../../../components/constants";

export function EditDay(props: DayProps) {
  const router = useRouter();
  const { id } = props;

  const onSubmit = async (data: FormData) => {
    const solutions = data.solutions.map((el) => el.value);
    const { solutions: _solutions, date, ...rest } = data;
    date.setHours(openingHour);

    try {
      const body = { ...rest, solutions, date };

      await fetch(`/api/day/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push(`/admin`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAction = async () => {
    await fetch(`/api/day/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  };

  return (
    <CreateDayForm
      {...props}
      onSubmit={onSubmit}
      deleteAction={deleteAction}
      submitButtonText="Lagre"
    />
  );
}
