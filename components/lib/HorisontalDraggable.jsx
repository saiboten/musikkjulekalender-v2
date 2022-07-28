import React from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useGesture } from "react-with-gesture";

export function HorisontalDraggable({ children }) {
  const [bind, { delta, down }] = useGesture();
  const { x, bg } = useSpring({
    x: down ? delta[0] : 0,
    immediate: name => down && name === "x",
    config: {
      mass: 1,
      tension: 180,
      friction: 4
    }
  });
  return (
    <animated.div {...bind()} style={{ background: bg }}>
      <animated.div
        style={{
          transform: interpolate([x], x => `translate3d(${x}px,0,0)`)
        }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
}
