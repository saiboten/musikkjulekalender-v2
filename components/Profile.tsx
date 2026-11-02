import React from "react";
import Image from "next/image";
import { Heading } from "./ui";
import { Spacer } from "./lib/Spacer";

export function Profile({ name, image, children }) {
  return (
    <div className="mb-4 rounded-[5px] bg-white py-2 text-center shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">
      <div className="relative inline-block">
        <Heading
          size="lg"
          className="absolute right-0 bottom-0 z-[1] mb-2 rounded-[5px] bg-primary p-[5px] text-white opacity-90 lg:-right-[15px] lg:-bottom-[15px]"
        >
          {name}
        </Heading>

        <Image src={image} alt={name} style={{ borderRadius: "5px" }} />
      </div>
      <Spacer multiply={0.5} />
      <Spacer multiply={0.5} />
      <div className="mb-8 px-4 text-left">{children}</div>
    </div>
  );
}
