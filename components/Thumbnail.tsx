import NextLink from "next/link";
import Image from "next/legacy/image";
import stein from "../img/thumbnail/stein.png";
import tobias from "../img/thumbnail/tobias21.png";
import matt from "../img/thumbnail/matt.png";
import kim from "../img/thumbnail/kim.png";
import bjarte from "../img/thumbnail/bjarte.png";
import tomas from "../img/thumbnail/tomas.png";
import rune from "../img/thumbnail/rune.jpg";
import skoyerfanden from "../img/thumbnail/skoyerfanden.png";
import { Link } from "@chakra-ui/react";

const thumbnailMap = {
  Stein: stein,
  Tobias: tobias,
  Matt: matt,
  Kim: kim,
  Bjarte: bjarte,
  Skoyerfanden: skoyerfanden,
  Tomas: tomas,
  Rune: rune,
};

export const Thumbnail = ({ image }: { image: string }) => {
  let imageSrc = thumbnailMap[image];

  return (
    <>
      {imageSrc ? (
        <NextLink href={`/profile/${image}`} passHref legacyBehavior>
          <Link
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.1)" }}
          >
            <Image
              src={imageSrc}
              alt="Profile picture"
              width={132}
              height={132}
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </Link>
        </NextLink>
      ) : null}
    </>
  );
};
