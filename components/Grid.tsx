import React from "react";

export const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="m-12 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-14">
    {children}
  </div>
);

export const GridItem = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex aspect-square items-center justify-center bg-white text-center text-black shadow-card">
    {children}
  </div>
);
