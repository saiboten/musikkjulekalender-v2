"use client";

import React, { useState } from "react";
import { Alert, Button, Heading, Input, Label, useToast } from "./ui";
import { Spacer } from "../components/lib/Spacer";

interface Props {
  nickname?: string;
}

export function AddNickName({ nickname: existingNick }: Props) {
  const [nickName, setNickName] = useState(existingNick ?? "");
  const [error, setError] = useState("");

  const toast = useToast();

  const setNickNameAPI = async () => {
    const response = await fetch(`/api/setnick?nick=${nickName}`);
    return response.json();
  };

  function submitNickname(e) {
    e.preventDefault();

    setNickNameAPI()
      .then((data: { success: boolean }) => {
        if (data.success) {
          toast({
            title: "Brukernavn oppdatert.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setError("Klarte ikke å oppdatere brukernavn. Prøv igjen senere.");
        }
      })
      .catch(() => {
        setError("Klarte ikke å oppdatere brukernavn. Prøv igjen senere.");
      });
  }

  return (
    <>
      <Heading size="md">Velg brukernavn</Heading>
      <Spacer />
      {!existingNick ? <p>Du ikke valgt kallenavn enda.</p> : null}
      <Spacer />
      <form onSubmit={submitNickname}>
        <div>
          <Label htmlFor="nickname">
            {existingNick ? "Endre" : "Opprett"} brukernavn
          </Label>
          <div className="flex">
            <Input
              className="mr-2 max-w-[22rem]"
              id="nickname"
              onChange={(e) => setNickName(e.target.value)}
              value={nickName}
              type="text"
            />
            <Button disabled={nickName.length < 3} type="submit">
              Endre
            </Button>
          </div>
        </div>
      </form>
      <Spacer />
      {error ? (
        <Alert status="error" icon title="Noe gikk galt">
          {error}
        </Alert>
      ) : null}
    </>
  );
}
