import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import styled from "styled-components";
import { H2 } from "../components/lib/Heading";
import { UnorderedList, ListElement } from "../components/lib/ListElement";
import { P } from "../components/lib/Paragraph";
import { Profile } from "../components/Profile";
import bjarte from "../img/bjarte.png";
import stein from "../img/stein.png";
import tomas from "../img/tomas.png";
import skoyerfanden from "../img/skoyerfanden.png";
import kim from "../img/kim.png";
import matt from "../img/matt.png";
import tobias from "../img/tobias.png";

const StyledBack = styled.a`
  margin-left: 1rem;
`;

const StyledSubmit = styled.input`
  background: #ececec;
  border: 0;
  padding: 1rem 2rem;
`;

const StyledContent = styled.div`
  font-size: 1.5rem;
  padding: 2rem;
  background-color: #fff;
`;

const StyledParagraph = styled.p`
  margin-bottom: 1rem;
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
        <H2>Hva er dette for noe?</H2>
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

        <H2>Bidragsytere</H2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(25rem, 1fr))",
            gridGap: "1rem",
            justifyItems: "center",
          }}
        >
          <Profile image={bjarte} name="Bjarte K. Helland">
            <p style={{ marginBottom: "1rem" }}>
              Bjarte er en ekstremt dyktig og allsidig trommis, som spiller i
              flere band enn de fleste. Han spiller blant annet i/med:
            </p>
            <UnorderedList>
              <ListElement>Jarle H Olsen Quadrasonic</ListElement>
              <ListElement>Powerslaves</ListElement>
              <ListElement>Jon Martin Skauge</ListElement>
              <ListElement>Pretty Blue</ListElement>
              <ListElement>Pitch Black Mentality</ListElement>
              <ListElement>Preachers</ListElement>
              <ListElement>Fastloaders</ListElement>
              <ListElement>Stein Hauge Band,</ListElement>
              <ListElement>Brutallica</ListElement>
              <ListElement>og mange flere.</ListElement>
            </UnorderedList>
            <p>
              For mer detaljer, gå til&nbsp;
              <a href="https://bjartekhelland.com/">bjartekhelland.com</a>, der
              du også kan se videoer, m.m.
            </p>
          </Profile>
          <Profile image={stein} name="Stein Henrik Olaussen">
            <P>
              Stein er en gitarist, bassist, trommis, vokalist, frontmann og
              generelt multiinstrumentalist. Han er mannen bak prosjektet Denver
              Mini, som hadde sin storhetstid på midten av 2000-tallet, og
              spiller for øyeblikket i band som{" "}
              <a href="https://vaerbitt.bandcamp.com/">Værbitt</a> og Kalfaret.
            </P>
            <P>
              Når Stein ikke spiller musikk, så løper han. Og han løper langt,
              og fort. I år sprang han inn til 2:38:59 på Berlin Maraton, en tid
              som er hinsides all fornuft.
            </P>
          </Profile>
          <Profile image={tomas} name="Tomas Osland">
            <P>
              Tomas er en rivende dyktig musiker som spiller bass i band som{" "}
              <a href="https://galar.bandcamp.com/">Galar</a> og{" "}
              <a href="https://vaerbitt.bandcamp.com/">Værbitt</a>. Han er også
              kapabel på både gitar, vokal og trommer, og du kan forvente å høre
              oppgaver der alt dette tas i bruk!
            </P>
            <P>
              Når Tomas ikke spiller musikk, kan du finne han på toppen av en
              fjelltopp, klatrende i en klatrevegg eller syklende gjennom
              landegrenser.
            </P>
          </Profile>
          <Profile image={skoyerfanden} name="Skøyerfanden">
            Hvem er denne mystiske skikkelsen? Har du anelse om hvem det kan
            være? Ikke nøl med å ta kontakt, vi lurer fælt!
          </Profile>
          <Profile image={kim} name="Kim">
            <P>
              Altmuligmann på trommer, bass og gitar. Kim fant ut i fjor at det
              var moro å klippe opp musikk til det ugjenkjennelige, så derfor
              har han valgt å gjøre dette til et fast innslag i julekalenderen.
            </P>
            <P>
              Kim spiller for tiden i Yona Yona (instagram:{" "}
              <a href="https://www.instagram.com/yonayonaband/">
                @yonayonaband
              </a>
              ), så sjekk det ut, og bor du i Oslo er det konsert 7. desember på
              Brewgata (Gratis!). Møte opp!
            </P>
          </Profile>
          <Profile image={matt} name="Matt Weigand">
            <P>
              Matt er selve hjernen bak det musikalske prosjektet{" "}
              <a href="https://officialnautilus.bandcamp.com/?fbclid=IwAR1yti6LKPM-lG-eBObbGAwFWF6KaeBoBbJug2MGyRdMymUpcLKje0j_ar4">
                Nautilus
              </a>
              , et progressivt metalband som har høstet mye gode
              tilbakemeldinger på sin første fullengder. Matt spiller også gitar
              i <a href="https://vaerbitt.bandcamp.com/">Værbitt</a>.
            </P>
            <P>
              Når Matt ikke spiller gitar, brygger han deilig øl, klapper hunden
              sin Luna, eller gjør helt andre ting.
            </P>
          </Profile>
          <Profile image={tobias} name="Tobias Rusås Olsen">
            <P>
              Tobias er selve mesterhjernen bak musikkjulekalender.no. Siden
              2011 har han stått bak all koding og design av nettsiden, lagt ut
              oppgaver, skrevet oppgavetekster og adminstrert facebooksiden.
            </P>
            <P>
              Tobias spiller trommer i bandet{" "}
              <a href="https://vaerbitt.bandcamp.com/">Værbitt</a>.
            </P>
          </Profile>
        </div>

        <H2>Kontakt</H2>
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
