import { ListElement, UnorderedList } from "./lib/ListElement";
import { Profile } from "./Profile";
import { P } from "./lib/Paragraph";
import bjarte from "../img/bjarte.png";
import stein from "../img/stein.png";
import tomas from "../img/tomas.png";
import skoyerfanden from "../img/skoyerfanden.png";
import kim from "../img/kim.png";
import matt from "../img/matt.png";
import tobias from "../img/tobias21.png";
import React from "react";
import { useRouter } from "next/router";
import { Box, Button, propNames } from "@chakra-ui/react";
import { Spacer } from "./lib/Spacer";

interface Profile {
  key: string;
  profile: JSX.Element;
}

export const Profiles = ({
  filterBy,
  showBackLink,
}: {
  filterBy?: string;
  showBackLink?: boolean;
}) => {
  const router = useRouter();

  let profiles: Profile[] = [
    {
      key: "Tobias",
      profile: (
        <Profile image={tobias} name="Tobias Rusås Olsen">
          <P>
            Tobias er skaperen av musikkjulekalender.no. Siden 2011 har han
            stått bak all koding og design av nettsiden, lagt ut oppgaver,
            skrevet oppgavetekster og adminstrert facebooksiden.
          </P>
          <P>
            Tobias spiller trommer i bandet{" "}
            <a href="https://vaerbitt.bandcamp.com/">Værbitt</a>.
          </P>
        </Profile>
      ),
    },
    {
      key: "Bjarte",
      profile: (
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
            <a href="https://bjartekhelland.com/">bjartekhelland.com</a>, der du
            også kan se videoer, m.m.
          </p>
        </Profile>
      ),
    },
    {
      key: "Stein",
      profile: (
        <Profile image={stein} name="Stein Henrik Olaussen">
          <P>
            Stein er en gitarist, bassist, trommis, vokalist, frontmann og
            generelt multiinstrumentalist. Han er mannen bak prosjektet Denver
            Mini, som hadde sin storhetstid på midten av 2000-tallet, og spiller
            for øyeblikket i band som{" "}
            <a href="https://vaerbitt.bandcamp.com/">Værbitt</a> og Kalfaret.
          </P>
          <P>
            Når Stein ikke spiller musikk, så løper han. Og han løper langt, og
            fort. I år sprang han inn til 2:38:59 på Berlin Maraton, en tid som
            er hinsides all fornuft.
          </P>
        </Profile>
      ),
    },
    {
      key: "Tomas",
      profile: (
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
      ),
    },
    {
      key: "Skoyerfanden",
      profile: (
        <Profile image={skoyerfanden} name="Skøyerfanden">
          Hvem er denne mystiske skikkelsen? Har du anelse om hvem det kan være?
          Ikke nøl med å ta kontakt, vi lurer fælt!
        </Profile>
      ),
    },
    {
      key: "Kim",
      profile: (
        <Profile image={kim} name="Kim">
          <P>
            Altmuligmann på trommer, bass og gitar. Kim fant ut i fjor at det
            var moro å klippe opp musikk til det ugjenkjennelige, så derfor har
            han valgt å gjøre dette til et fast innslag i julekalenderen.
          </P>
          <P>
            Kim spiller for tiden i Yona Yona (instagram:{" "}
            <a href="https://www.instagram.com/yonayonaband/">@yonayonaband</a>
            ), så sjekk det ut, og bor du i Oslo er det konsert 7. desember på
            Brewgata (Gratis!). Møte opp!
          </P>
        </Profile>
      ),
    },
    {
      key: "Matt",
      profile: (
        <Profile image={matt} name="Matt Weigand">
          <P>
            Matt er selve hjernen bak det musikalske prosjektet{" "}
            <a href="https://officialnautilus.bandcamp.com/?fbclid=IwAR1yti6LKPM-lG-eBObbGAwFWF6KaeBoBbJug2MGyRdMymUpcLKje0j_ar4">
              Nautilus
            </a>
            , et progressivt metalband som har høstet mye gode tilbakemeldinger
            på sin første fullengder. Matt spiller også gitar i{" "}
            <a href="https://vaerbitt.bandcamp.com/">Værbitt</a>.
          </P>
          <P>
            Når Matt ikke spiller gitar, brygger han deilig øl, klapper hunden
            sin Luna, eller gjør helt andre ting.
          </P>
        </Profile>
      ),
    },
    {
      key: "Rune",
      profile: (
        <Profile image={skoyerfanden} name="Rune">
          <P>Info kommer</P>
        </Profile>
      ),
    },
  ];

  if (filterBy) {
    profiles = profiles.filter(
      (el) => el.key.toLowerCase() === filterBy.toLowerCase()
    );
  }

  return (
    <>
      {showBackLink ? (
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={() => router.back()}>Tilbake</Button>
        </Box>
      ) : null}

      {profiles.map((el, index) => (
        <React.Fragment key={index}>
          <Spacer />
          {el.profile}
        </React.Fragment>
      ))}
    </>
  );
};
