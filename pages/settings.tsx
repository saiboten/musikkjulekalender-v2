import React, { useState } from "react";
import Layout from "../components/Layout";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { AddNickName } from "../components/AddNickName";
import {
  Box,
  Heading,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { Spacer } from "../components/lib/Spacer";
import { useSession } from "next-auth/react";

interface Props {
  nickname?: string;
  email?: string;
  name?: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  return {
    props: {
      nickname: user.nickname,
      email: user.email,
      name: user.name,
    },
  };
};

function Settings({ nickname: existingNick, email, name }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const cancelRef = React.useRef();

  async function handleDelete() {
    setDeleteConfirmed(true);
    await fetch("/api/deleteuser");
  }

  return (
    <Layout whiteBg customSize={40}>
      <Heading size="lg">Innstillinger</Heading>
      <Spacer />
      <Text>
        Du er innlogget som{" "}
        <strong>
          {name} ({email})
        </strong>
      </Text>
      <Spacer />

      <AddNickName nickname={existingNick} />

      <Heading size="md">Slett bruker</Heading>
      <Flex alignItems="center">
        <Text mr="3">Vil du slette brukeren din?</Text>
        <Button onClick={onOpen}>Ja, slett brukeren min</Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Slett bruker
            </AlertDialogHeader>

            <AlertDialogBody>
              Er du sikker? Du vil ikke kunne få tilbake brukeren din.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  handleDelete();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {deleteConfirmed ? (
        <>
          <Spacer />
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>:&apos;(</AlertTitle>
            <AlertDescription>
              Brukeren din vil bli slettet i løpet av få virkedager. Takk for
              alt!
            </AlertDescription>
          </Alert>
        </>
      ) : null}
    </Layout>
  );
}

export default Settings;
