import React from "react";
import { cn } from "./cn";

type HeadingSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<HeadingSize, string> = {
  sm: "text-base leading-[1.2]",
  md: "text-xl leading-[1.2]",
  lg: "text-2xl leading-[1.33] md:text-3xl md:leading-[1.2]",
  xl: "text-3xl leading-[1.33] lg:text-4xl lg:leading-[1.2]",
};

const defaultTag: Record<HeadingSize, "h2" | "h3" | "h4"> = {
  sm: "h4",
  md: "h3",
  lg: "h2",
  xl: "h2",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: HeadingSize;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ size = "xl", as, className, ...rest }: HeadingProps) {
  const Tag = as ?? defaultTag[size];
  return (
    <Tag className={cn("font-bold", sizeClasses[size], className)} {...rest} />
  );
}
