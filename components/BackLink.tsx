import Link from "next/link";
import { buttonClasses } from "./ui";

export const BackLink = () => (
  <Link href="/" className={buttonClasses()}>
    Tilbake
  </Link>
);
