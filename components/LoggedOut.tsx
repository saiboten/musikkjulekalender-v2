import Link from "next/link";
import { Heading, buttonClasses } from "./ui";
import { Footer } from "./Footer";
import Layout from "./Layout";
import { Spacer } from "./lib/Spacer";
import { MainHeading } from "./MainHeading";

export const LoggedOut = () => {
  return (
    <div>
      <div className="mx-auto max-w-[65rem]">
        <MainHeading />
      </div>
      <Layout whiteBg>
        <Spacer />
        <Heading>Hva er dette?</Heading>
        <Spacer />
        <p>
          Musikkjulekalenderen er en musikkquiz-konkurranse. Hver dag i hele
          desember åpnes det en luke i kalenderen, et lydklipp som etterligner
          en kjent låt - din oppgave er å gjette hvilken låt det er snakk om!
        </p>
        <Spacer />
        <Heading size="lg">Premier!</Heading>
        <Spacer />
        <p>
          Brukeren ved flest poeng etter 24 dager blir premiert med et svært
          ekslusivt musikkjulekalender-krus som passer perfekt i premiehyllen
          eller i kjøkkenskapet.
        </p>
        <Spacer />
        <p>
          <Link href="/auth/signin" className={buttonClasses()}>
            Logg inn
          </Link>{" "}
          for å starte morroa!
        </p>
      </Layout>
      <Footer />
    </div>
  );
};
