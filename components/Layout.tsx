import React, { ReactNode } from "react";
import { cn } from "./ui";

type Props = {
  children: ReactNode;
  whiteBg?: boolean;
  customSize?: number;
};

const Layout: React.FC<Props> = (props) => (
  <div
    className={cn(
      "mx-auto my-4 rounded-[2rem] p-4 opacity-95",
      props.whiteBg ? "bg-white" : "bg-inherit"
    )}
    style={{ maxWidth: `${props.customSize ?? 65}rem` }}
  >
    <div className="py-4">{props.children}</div>
  </div>
);

export default Layout;
