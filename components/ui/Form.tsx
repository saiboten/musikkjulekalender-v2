import React from "react";
import { cn } from "./cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-[#e2e8f0] bg-transparent px-4 text-base transition-colors duration-200 outline-none",
        "hover:border-[#cbd5e0] focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] focus:hover:border-[#3182ce]",
        className
      )}
      {...rest}
    />
  );
}

export function Label({
  className,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    // Callers pass htmlFor (or wrap the control) through ...rest.
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={cn("mb-2 block text-base font-medium", className)}
      {...rest}
    />
  );
}

export function Checkbox({
  className,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={cn("inline-flex cursor-pointer items-center gap-2", className)}
    >
      <input
        type="checkbox"
        className="size-4 cursor-pointer accent-[#3182ce]"
        {...rest}
      />
      <span>{children}</span>
    </label>
  );
}

export function Radio({
  className,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={cn("inline-flex cursor-pointer items-center gap-2", className)}
    >
      <input
        type="radio"
        className="size-4 cursor-pointer accent-[#3182ce]"
        {...rest}
      />
      <span>{children}</span>
    </label>
  );
}
