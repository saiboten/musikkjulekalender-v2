import {
  Box,
  Button,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { getProviders, signIn } from "next-auth/react";
import Layout from "../../components/Layout";
import { Spacer } from "../../components/lib/Spacer";
import { useRouter } from "next/router";

function errorCodeToMessage(message?: string | string[]) {
  if (message === undefined) {
    return undefined;
  }

  if (message === "OAuthAccountNotLinked") {
    return "Du må logge inn med samme innlogging som du brukte første gang. F.eks hvis du brukte Google må du bruker Google på nytt.";
  } else {
    return "Ukjent feil";
  }
}

export default function SignIn({
  providers,
}: {
  providers: { name: string; id: string }[];
}) {
  const router = useRouter();
  const errorCode = errorCodeToMessage(router.query.error);
  return (
    <Layout>
      <Box
        display="flex"
        gap="1rem"
        flexDir="column"
        alignItems="center"
        backgroundColor="#fff"
        maxWidth="35rem"
        margin="0 auto"
        padding="1.5rem"
        borderRadius="5px"
      >
        <Heading size="lg">Innlogging</Heading>
        <Spacer />

        {errorCode ? (
          <Alert status="error" display="flex" flexDir="column">
            <Box display="flex" mb="2" mt="2">
              <AlertIcon />
              <AlertTitle>Noe gikk galt!</AlertTitle>
            </Box>
            <AlertDescription>{errorCode}</AlertDescription>
          </Alert>
        ) : null}

        {Object.values(providers).map((provider) => (
          <Box key={provider.name}>
            <Button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              Logg inn med {provider.name}
            </Button>
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
