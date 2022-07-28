import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
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
      {!existingNick ? <Text>Du ikke valgt kallenavn enda.</Text> : null}
      <Spacer />
      <form onSubmit={submitNickname}>
        <FormControl>
          <FormLabel htmlFor="nickname">
            {existingNick ? "Endre" : "Opprett"} brukernavn
          </FormLabel>
          <Flex>
            <Input
              mr="2"
              maxWidth="22rem"
              id="nickname"
              onChange={(e) => setNickName(e.target.value)}
              value={nickName}
              type="text"
            ></Input>
            <Button disabled={nickName.length < 3} type="submit">
              Endre
            </Button>
          </Flex>
        </FormControl>
      </form>
      <Spacer />
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Noe gikk galt</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
