import { Alert, Heading, WarningIcon } from "../../../components/ui";
import Layout from "../../../components/Layout";
import { Spacer } from "../../../components/lib/Spacer";
import { socialProviders } from "../../../lib/auth";
import { SignInButton } from "./sign-in-button";

function errorCodeToMessage(message?: string | string[]) {
  if (message === undefined) {
    return undefined;
  }

  if (message === "account_not_linked") {
    return "Du må logge inn med samme innlogging som du brukte første gang. F.eks hvis du brukte Google må du bruker Google på nytt.";
  } else {
    return "Ukjent feil";
  }
}

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const errorCode = errorCodeToMessage(error);

  return (
    <Layout>
      <div className="mx-auto flex max-w-[35rem] flex-col items-center gap-4 rounded-[5px] bg-white p-6">
        <Heading size="lg">Innlogging</Heading>
        <Spacer />

        {errorCode ? (
          <Alert status="error" className="flex-col">
            <div className="my-2 flex items-center">
              <WarningIcon className="me-3 size-5 text-[#e53e3e]" />
              <span className="font-bold">Noe gikk galt!</span>
            </div>
            <span>{errorCode}</span>
          </Alert>
        ) : null}

        <Alert status="info" className="flex-col text-center">
          <div className="my-2 font-bold">Facebook</div>
          <span>
            Innlogging med Facebook er ikke lenger en mulighet. Håper du kan
            bruke en av de andre alternativene!
          </span>
        </Alert>

        {socialProviders.map((provider) => (
          <div key={provider.id}>
            <SignInButton id={provider.id} name={provider.name} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
