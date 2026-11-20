"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DayProps } from "../../../components/Day";
import {
  CreateDayForm,
  FormData,
  toDayPayload,
} from "../../../components/CreateDayForm";
import { useToast } from "../../../components/ui";
import { openingHour } from "../../../components/constants";

export function EditDay(props: DayProps) {
  const router = useRouter();
  const toast = useToast();
  const { id } = props;

  const onSubmit = async (data: FormData) => {
    try {
      const body = toDayPayload(data, openingHour);

      const res = await fetch(`/api/day/${id}`, {
        method: "PUT",
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
