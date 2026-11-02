import React from "react";
import { cn } from "../ui";

export const Audio = ({
  className,
  ...rest
}: React.AudioHTMLAttributes<HTMLAudioElement>) => (
  <audio className={cn("mx-auto w-full max-w-[35rem]", className)} {...rest} />
);
