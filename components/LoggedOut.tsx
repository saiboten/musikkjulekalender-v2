import { Heading, Text } from "@chakra-ui/react";
import { Footer } from "./Footer";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";
import { MainHeading } from "./MainHeading";

export const LoggedOut = () => {
  return (
    <Layout whiteBg>
      <MainHeading />
      <Spacer />
      <Heading>Hva er dette?</Heading>
      <Spacer />
      <Text>
        Musikkjulekalenderen er en musikkquiz-konkurranse. Hver dag i hele
        desember åpnes det en luke i kalenderen, et lydklipp som etterligner en
        kjent låt - din oppgave er å gjette hvilken låt det er snakk om!
      </Text>
      <Spacer />
      <Heading size="lg">Premier!</Heading>
      <Spacer />
      <Text>
        Brukeren ved flest poeng etter 24 dager blir premiert med et svært
        ekslusivt musikkjulekalender-krus som passer perfekt i premiehyllen
        eller i kjøkkenskapet.
      </Text>
      <Spacer />
      <Text>Start ved å logge inn for å høre din første oppgaven.</Text>
      <Footer />
    </Layout>
  );
};
