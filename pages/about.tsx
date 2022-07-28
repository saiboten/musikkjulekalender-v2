import React from "react";
import Layout from "../components/Layout";
import styled from "styled-components";
import { Heading } from "@chakra-ui/react";
import { Profiles } from "../components/Profiles";

const StyledBack = styled.a`
  margin-left: 1rem;
`;

const StyledSubmit = styled.input`
  background: #ececec;
  border: 0;
  padding: 1rem 2rem;
`;

const StyledContent = styled.div`
  font-size: 1rem;
  padding: 1.5rem;
  background-color: #fff;
`;

const StyledParagraph = styled.p`
  margin-bottom: 0.5rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  border: 0.125rem solid rgba(0, 0, 0, 0.2);
`;

const About: React.FC = () => {
  return (
    <Layout>
      <StyledContent>
        <Heading size="lg">Hva er dette for noe?</Heading>
        <StyledParagraph>
          Musikkjulekalenderen er en musikkquiz-konkurranse. Hver dag åpnes det
          en ny luke i kalenderen, og en luke er et lydklipp - din oppgave er å
          gjette hvilken låt som spilles!
        </StyledParagraph>
        <StyledParagraph>
          Du vil umiddelbart få svar på om du hadde riktig eller feil svar.
        </StyledParagraph>
        <StyledParagraph>
          Vi har en toppscoreliste som viser hvem som leder konkurrensen, i
          tillegg til en dagsliste med de som har svart riktig på dagens
          oppgave.
        </StyledParagraph>
        <StyledParagraph>
          Den beste brukeren blir premiert med et krus for to, og et diplom!
        </StyledParagraph>

        <Heading>Bidragsytere</Heading>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))",
            gridGap: "1rem",
            justifyItems: "center",
          }}
        >
          <Profiles />
        </div>

        <Heading>Kontakt</Heading>
        <StyledParagraph>
          Den enkleste måten å ta kontakt med folket bak kalenderen er å bruke
          vår{" "}
          <a href="https://www.facebook.com/musikkjulekalender">
            facebook-side
          </a>
        </StyledParagraph>
        <StyledParagraph>
          Det er også mulig å ta kontakt med mannen bak kalenderen - Tobias - på{" "}
          <a href="http://www.twitter.com/saiboten">twitter</a>
        </StyledParagraph>
      </StyledContent>
    </Layout>
  );
};

export default About;
