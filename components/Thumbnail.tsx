import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import stein from "../img/thumbnail/stein.png";
import tobias from "../img/thumbnail/tobias.png";
import matt from "../img/thumbnail/matt.png";
import kim from "../img/thumbnail/kim.png";
import bjarte from "../img/thumbnail/bjarte.png";

const thumbnailMap = {
  Stein: stein,
  Tobias: tobias,
  Matt: matt,
  Kim: kim,
  Bim: bjarte,
};

export const Thumbnail = ({ image }: { image: string }) => {
  let imageSrc = thumbnailMap[image];

  return (
    <>
      {imageSrc ? (
        <Link href={`/profile/${image}`}>
          <Image
            src={imageSrc}
            alt="Profile picture"
            width="132px"
            height="132px"
            style={{ borderRadius: "50%", cursor: "pointer" }}
          />
        </Link>
      ) : null}
    </>
  );
};
