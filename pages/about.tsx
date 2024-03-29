import React from "react";
import Layout from "../components/Layout";
import styled from "styled-components";
import { Heading, Text } from "@chakra-ui/react";
import { Profiles } from "../components/Profiles";
import { Spacer } from "../components/lib/Spacer";

const StyledParagraph = styled.p`
  margin-bottom: 0.5rem;
`;

const About: React.FC = () => {
  return (
    <Layout whiteBg>
      <Heading size="lg">Hva er dette for noe?</Heading>
      <Spacer />
      <StyledParagraph>
        Musikkjulekalenderen er en musikkquiz-konkurranse. Hver dag åpnes det en
        ny luke i kalenderen, og en luke er et lydklipp - din oppgave er å
        gjette hvilken låt som spilles!
      </StyledParagraph>
      <StyledParagraph>
        Du vil umiddelbart få svar på om du hadde riktig eller feil svar.
      </StyledParagraph>
      <StyledParagraph>
        Vi har en toppscoreliste som viser hvem som leder konkurrensen, i
        tillegg til en dagsliste med de som har svart riktig på dagens oppgave.
      </StyledParagraph>
      <StyledParagraph>
        Den beste brukeren blir premiert med et krus for to, og et diplom!
      </StyledParagraph>
      <Heading size="md">Bidragsytere</Heading>
      <Profiles />
      <Heading size="md">Kontakt</Heading>
      <Spacer />
      <StyledParagraph>
        Den enkleste måten å ta kontakt med folket bak kalenderen er å bruke vår{" "}
        <a href="https://www.facebook.com/musikkjulekalender">facebook-side</a>
      </StyledParagraph>
      <StyledParagraph>
        Det er også mulig å ta kontakt med mannen bak kalenderen - Tobias - på{" "}
        <a href="http://www.twitter.com/saiboten">twitter</a>
      </StyledParagraph>
      <Spacer />
      <Heading size="md">Kredittering</Heading>
      <Spacer />
      Bakgrunnsbilde:{" "}
      <a href="https://www.freepik.com/vectors/christmas-tree-snow">
        Christmas tree snow vector created by vectorpocket - www.freepik.com
      </a>
      <Spacer />
      <Heading size="md" mb="2">
        Personvern
      </Heading>
      <Text>
        Vi tar personvern på alvor, og samler kun inn følgende data: epost og
        navn. Dette brukes kun for å opprette bruker, og for å kunne tilby et
        standard brukernavn.
      </Text>
      <Spacer />
      <Heading size="sm" mb="2">
        Sletting av data
      </Heading>
      <Text>
        Send en epost til saiboten@gmail.com og be om å få slettet dine data, så
        sletter vi.
      </Text>
      <Spacer />
      <Heading size="md" mb="2">
        Terms of Service
      </Heading>
      <Heading size="sm" mb="2">
        Vilkår for bruk
      </Heading>
      <Text>
        Følg <a href="/tos">denne lenken</a>
      </Text>
      <Spacer />
      <Heading size="sm" mb="2">
        Privacy Policy
      </Heading>
      <Text>
        Følg <a href="/privacypolicy">denne lenken</a>
      </Text>
    </Layout>
  );
};

export default About;
