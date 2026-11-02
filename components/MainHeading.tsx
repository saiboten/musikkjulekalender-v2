import { Heading } from "./ui";
import Image from "next/image";
import { HorisontalDraggable } from "./lib/HorisontalDraggable";
import nisse from "../img/julenissetransparent.png";

export const MainHeading = () => {
  return (
    <div className="flex flex-row pt-4 text-left text-white max-[45rem]:flex-col max-[45rem]:items-center max-[45rem]:justify-between max-[45rem]:p-2">
      <Heading>Musikkjulekalender 2026</Heading>
      <HorisontalDraggable>
        <div className="text-center transition-transform duration-200 hover:scale-110">
          <Image
            draggable={false}
            src={nisse}
            alt="Rockete julsenisse med gitar"
            width={300}
            height={300}
          />
        </div>
      </HorisontalDraggable>
    </div>
  );
};
