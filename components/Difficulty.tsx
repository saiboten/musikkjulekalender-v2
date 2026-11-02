import React from "react";
import { cn } from "./ui";

// A shiny "ball" with two highlight dots drawn by ::before/::after.
const ballClasses = [
  "relative ml-2 size-10 rounded-full border",
  "before:absolute before:top-[0.85rem] before:left-[1.6rem] before:h-[0.65rem] before:w-2 before:skew-x-2 before:rounded-full before:bg-[#fdf2f2] before:shadow-[0_0_10px_rgba(250,250,250,0.9),inset_0_0_4px_#fdf2f2] before:transition-all before:duration-350 before:ease-in-out before:content-['']",
  "after:absolute after:top-[0.4rem] after:left-6 after:h-[0.3rem] after:w-1 after:skew-x-10 after:rounded-full after:bg-[#fdf2f2] after:shadow-[0_0_10px_rgba(250,250,250,0.9),inset_0_0_4px_#fdf2f2] after:transition-all after:duration-350 after:ease-in-out after:content-['']",
].join(" ");

const emptyClasses =
  "border-[#c5ff00] bg-[linear-gradient(to_bottom,#6de381_50%,#0bce00)] shadow-[inset_0px_2px_1px_#29ce00,inset_0px_-4px_0px_2px_#16ce00]";

const filledClasses =
  "border-[red] bg-[linear-gradient(to_bottom,#e36d6d_50%,#ce0000)] shadow-[inset_0px_2px_1px_#ce0000,inset_0px_-4px_0px_2px_#ce0000]";

interface Props {
  difficulty: number;
}

export function Difficulty({ difficulty }: Props) {
  const list = [0, 1, 2].map((i) => i < difficulty);

  return (
    <div className="mb-4 flex flex-col items-end justify-between text-base">
      <div className="mb-2 flex justify-end">
        {list.map((filled, index) => (
          <span
            key={index}
            className={cn(ballClasses, filled ? filledClasses : emptyClasses)}
          />
        ))}
      </div>
      <span className="pr-[0.3rem]">Vanskelighetsgrad</span>
    </div>
  );
}
