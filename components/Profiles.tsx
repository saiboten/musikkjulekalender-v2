import { ListElement, UnorderedList } from "./lib/ListElement";
import { Profile } from "./Profile";
import { P } from "./lib/Paragraph";
import bjarte from "../img/bjarte.png";
import rune from "../img/rune.jpg";
import stein from "../img/stein.png";
import tomas from "../img/tomas.png";
import skoyerfanden from "../img/skoyerfanden.png";
import kim from "../img/kim.png";
import matt from "../img/matt.png";
import tobias from "../img/tobias22.png";
import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Alert, Box, Button, Link, LinkBox } from "@chakra-ui/react";
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
      key: "Arild",
      profile: (
        <Profile image={skoyerfanden} name="Arild Øren Wanwik">
          <P>Arild er en multiinstrumentalist og produsent, bosatt i Bergen.</P>
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
          <Alert variant="solid" status="info">
            Bjarte spiller live med Quadrasonic lørdag 7. desember (2024) på
            Kvarteret i Bergen! Løp og se!
          </Alert>
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
            fort.
          </P>
        </Profile>
      ),
    },
    {
      key: "Sindre",
      profile: (
        <Profile image={skoyerfanden} name="Sindre Tveiterås">
          <P>Mer info om Sindre kommer snart.</P>
        </Profile>
      ),
    },
    {
      key: "Tomas",
      profile: (
        <Profile image={tomas} name="Tomas Osland">
          <P>
            Tomas er en rivende dyktig musiker som spiller bass i band som{" "}
            <a href="https://www.facebook.com/Bismarckdoom/?locale=nb_NO/">
              Bismarck
            </a>
            , <a href="https://galar.bandcamp.com/">Galar</a> og{" "}
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
      key: "TobiasSindre",
      profile: (
        <Profile image={skoyerfanden} name="Tobias og Sindre">
          <Link
            href="/profile/tobias"
            as={NextLink}
            style={{ textDecoration: "underline" }}
          >
            Tobias
          </Link>{" "}
          og{" "}
          <Link
            as={NextLink}
            style={{ textDecoration: "underline" }}
            href="/profile/sindre"
          >
            Sindre
          </Link>
        </Profile>
      ),
    },
    {
      key: "TobiasStein",
      profile: (
        <Profile image={skoyerfanden} name="Tobias og Stein">
          To hoder fungerer bedre enn ett! Det kan skje at{" "}
          <Link>
            <NextLink href="/profile/tobias">Tobias</NextLink>
          </Link>{" "}
          og{" "}
          <Link>
            <NextLink href="/profile/stein">Stein</NextLink>
          </Link>{" "}
          slå hodene sine sammen.
        </Profile>
      ),
    },
    {
      key: "Kim",
      profile: (
        <Profile image={kim} name="Kim">
          <P>
            Til dagen er Kim sysadmin/IT-potet, men på kveldene dukker han opp i
            anerkjente (ifølge ham selv) band som Yona Yona og Taxi Bear, kjent
            helt fra Stovner til Carl Berners Plass. Foreløpig har det blitt
            rolig på konsert-fronten, men håper å dukke opp på en scene nær deg
            (dersom &quot;nær deg&quot; er et sted mellom Stovner og Carl
            Berners Plass) til nyåret.
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
        <Profile image={rune} name="Oslo-Arrogansen">
          <P>
            Ble innhentet av Skøyerfanden etter en bryllups-gig ikke langt fra
            bryggen. Sliter nå med tidsklemma grunnet småbarnslivet. Mener selv
            han gehør.
          </P>
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
