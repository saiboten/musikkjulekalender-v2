"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CreateDayForm,
  FormData,
  toDayPayload,
} from "../../components/CreateDayForm";
import { useToast } from "../../components/ui";
import { openingHour } from "../../components/constants";

export function CreateDay({ standardDate }: { standardDate: string }) {
  const router = useRouter();
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const body = toDayPayload(data, openingHour);

      const res = await fetch(`/api/day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast({
          title: "Kunne ikke lagre",
          description: `Serveren svarte ${res.status}. Prøv igjen.`,
          status: "error",
          duration: 8000,
          isClosable: true,
        });
        return;
      }
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
