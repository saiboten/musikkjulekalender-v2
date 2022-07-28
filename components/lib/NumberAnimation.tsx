import React from "react";
import { animated, useSpring } from "react-spring";

export function NumberAnimation({ children }: { children: number }) {
  const { x } = useSpring({
    config: {
      mass: 20,
      tension: 600,
      friction: 200,
      clamp: true,
    },
    from: {
      x: 0,
    },
    x: children,
  });

  return <animated.span>{x.to((val) => Math.floor(val))}</animated.span>;
}
