import React from "react";
import { useTrail, animated } from "react-spring";

export function FadeInList({ list }) {
  const trail = useTrail(list.length, {
    config: {
      mass: 1,
      clamp: true,
      tension: 2000,
      friction: 50
    },
    opacity: 1,
    from: { opacity: 0 }
  });

  return trail.map(({ opacity }, index) => (
    <animated.div style={{ opacity }}>{list[index]}</animated.div>
  ));
}
