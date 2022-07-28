import { Box, Button, Heading } from "@chakra-ui/react";
import { getProviders, signIn } from "next-auth/react";
import Layout from "../../components/Layout";
import { Spacer } from "../../components/lib/Spacer";

export default function SignIn({
  providers,
}: {
  providers: { name: string; id: string }[];
}) {
  return (
    <Layout>
      <Box
        display="flex"
        gap="1rem"
        flexDir="column"
        alignItems="center"
        backgroundColor="#fff"
        maxWidth="25rem"
        margin="0 auto"
        padding="1.5rem"
        borderRadius="5px"
      >
        <Heading size="lg">Innlogging</Heading>
        <Spacer />
        {Object.values(providers).map((provider) => (
          <Box key={provider.name}>
            <Button onClick={() => signIn(provider.id)}>
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
