import React from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { Heading } from "../../components/ui";
import { Profiles } from "../../components/Profiles";
import { Spacer } from "../../components/lib/Spacer";

const About: React.FC = () => {
  return (
    <Layout whiteBg>
      <Heading size="lg">Hva er dette for noe?</Heading>
      <Spacer />
      <p className="mb-2">
        Musikkjulekalenderen er en musikkquiz-konkurranse. Hver dag åpnes det en
        ny luke i kalenderen, og en luke er et lydklipp - din oppgave er å
        gjette hvilken låt som spilles!
      </p>
      <p className="mb-2">
        Du vil umiddelbart få svar på om du hadde riktig eller feil svar.
      </p>
      <p className="mb-2">
        Vi har en toppscoreliste som viser hvem som leder konkurrensen, i
        tillegg til en dagsliste med de som har svart riktig på dagens oppgave.
      </p>
      <p className="mb-2">
        Den beste brukeren blir premiert med et krus for to, og et diplom!
      </p>
      <Heading size="md">Bidragsytere</Heading>
      <Profiles />
      <Heading size="md">Kontakt</Heading>
      <Spacer />
      <p className="mb-2">
        Den enkleste måten å ta kontakt med folket bak kalenderen er å bruke vår{" "}
        <a href="https://www.facebook.com/musikkjulekalender">facebook-side</a>
      </p>
      <p className="mb-2">
        Det er også mulig å ta kontakt med mannen bak kalenderen - Tobias - på{" "}
        <a href="http://www.twitter.com/saiboten">twitter</a>
      </p>
      <Spacer />
      <Heading size="md">Kredittering</Heading>
      <Spacer />
      Bakgrunnsbilde:{" "}
      <a href="https://www.freepik.com/vectors/christmas-tree-snow">
        Christmas tree snow vector created by vectorpocket - www.freepik.com
      </a>
      <Spacer />
      <Heading size="md" className="mb-2">
        Personvern
      </Heading>
      <p>
        Vi tar personvern på alvor, og samler kun inn følgende data: epost og
        navn. Dette brukes kun for å opprette bruker, og for å kunne tilby et
        standard brukernavn.
      </p>
      <Spacer />
      <Heading size="sm" className="mb-2">
        Sletting av data
      </Heading>
      <p>
        Send en epost til saiboten@gmail.com og be om å få slettet dine data, så
        sletter vi.
      </p>
      <Spacer />
      <Heading size="md" className="mb-2">
        Terms of Service
      </Heading>
      <Heading size="sm" className="mb-2">
        Vilkår for bruk
      </Heading>
      <p>
        Følg{" "}
        <Link href="/tos" className="underline">
          denne lenken
        </Link>
      </p>
      <Spacer />
      <Heading size="sm" className="mb-2">
        Privacy Policy
      </Heading>
      <p>
        Følg{" "}
        <Link href="/privacypolicy" className="underline">
          denne lenken
        </Link>
      </p>
    </Layout>
  );
};

export default About;
