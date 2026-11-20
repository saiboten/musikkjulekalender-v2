import React from "react";
import { cn } from "./ui";

export const FrontPageBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("rounded-[5px] bg-white p-4 shadow-card", className)}>
      {children}
    </div>
  );
};
