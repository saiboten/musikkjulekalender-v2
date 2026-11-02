import React from "react";
import { cn } from "./cn";

export function List({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("list-none", className)} {...rest} />;
}

export function UnorderedList({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("ms-4 list-disc", className)} {...rest} />;
}

export function ListItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}
