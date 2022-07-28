import Link from "next/link";
import Image from "next/image";
import stein from "../img/thumbnail/stein.png";
import tobias from "../img/thumbnail/tobias.png";
import matt from "../img/thumbnail/matt.png";
import kim from "../img/thumbnail/kim.png";
import bjarte from "../img/thumbnail/bjarte.png";
import tomas from "../img/thumbnail/tomas.png";
import skoyerfanden from "../img/thumbnail/skoyerfanden.png";

const thumbnailMap = {
  Stein: stein,
  Tobias: tobias,
  Matt: matt,
  Kim: kim,
  Bjarte: bjarte,
  Skoyerfanden: skoyerfanden,
  Tomas: tomas,
};

export const Thumbnail = ({ image }: { image: string }) => {
  let imageSrc = thumbnailMap[image];

  return (
    <>
      {imageSrc ? (
        <Link href={`/profile/${image}`} passHref>
          <a>
            <Image
              src={imageSrc}
              alt="Profile picture"
              width="132px"
              height="132px"
              style={{ borderRadius: "50%", cursor: "pointer" }}
            />
          </a>
        </Link>
      ) : null}
    </>
  );
};
