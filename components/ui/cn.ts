import { twMerge } from "tailwind-merge";

/** Join class names, letting later Tailwind classes override earlier ones. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
