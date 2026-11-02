import React from "react";
import { cn } from "./cn";
import { CheckIcon, InfoIcon, WarningIcon } from "./icons";

type Status = "info" | "error" | "success";

const subtleClasses: Record<Status, string> = {
  info: "bg-[#bee3f8]",
  error: "bg-[#fed7d7]",
  success: "bg-[#c6f6d5]",
};

const solidClasses: Record<Status, string> = {
  info: "bg-[#3182ce] text-white",
  error: "bg-[#e53e3e] text-white",
  success: "bg-[#38a169] text-white",
};

const iconColor: Record<Status, string> = {
  info: "text-[#3182ce]",
  error: "text-[#e53e3e]",
  success: "text-[#38a169]",
};

const icons: Record<Status, React.ComponentType<{ className?: string }>> = {
  info: InfoIcon,
  error: WarningIcon,
  success: CheckIcon,
};

interface AlertProps {
  status?: Status;
  variant?: "subtle" | "solid";
  /** Show the status icon before the content. */
  icon?: boolean;
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Alert({
  status = "info",
  variant = "subtle",
  icon = false,
  title,
  className,
  children,
}: AlertProps) {
  const StatusIcon = icons[status];
  return (
    <div
      role="alert"
      className={cn(
        "relative flex w-full items-center overflow-hidden px-4 py-3",
        variant === "solid" ? solidClasses[status] : subtleClasses[status],
        className
      )}
    >
      {icon ? (
        <StatusIcon
          className={cn(
            "me-3 size-5",
            variant === "solid" ? "text-current" : iconColor[status]
          )}
        />
      ) : null}
      <div>
        {title ? <span className="me-2 font-bold">{title}</span> : null}
        {children}
      </div>
    </div>
  );
}
