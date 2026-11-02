import React from "react";

export const FrontPageBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-[5px] bg-white p-4 shadow-card">{children}</div>
  );
};
