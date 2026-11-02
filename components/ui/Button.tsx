import React from "react";
import { cn } from "./cn";

type Variant = "default" | "danger";

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[#edf2f7] text-ink hover:bg-[#e2e8f0] active:bg-[#cbd5e0] disabled:hover:bg-[#edf2f7]",
  danger:
    "bg-[#e53e3e] text-white hover:bg-[#c53030] active:bg-[#9b2c2c] disabled:hover:bg-[#e53e3e]",
};

export const buttonClasses = (
  variant: Variant = "default",
  className?: string
) =>
  cn(
    "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-4 text-base leading-[1.2] font-semibold whitespace-nowrap transition-colors duration-200 select-none",
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4299e1]/60",
    "disabled:cursor-not-allowed disabled:opacity-40",
    variantClasses[variant],
    className
  );

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  variant = "default",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, className)}
      {...rest}
    />
  );
}
