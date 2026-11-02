import { cn } from "./cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Laster"
      className={cn(
        "inline-block size-6 animate-spin rounded-full border-2 border-current border-b-transparent border-l-transparent [animation-duration:0.45s]",
        className
      )}
    />
  );
}
