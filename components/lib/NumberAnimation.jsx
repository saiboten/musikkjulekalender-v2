import React from "react";
import { number } from "prop-types";
import { animated, useSpring } from "react-spring";

export function NumberAnimation({ children }) {
  const { x } = useSpring({
    config: {
      mass: 20,
      tension: 600,
      friction: 200,
      clamp: true
    },
    from: {
      x: 0
    },
    x: children
  });

  return <animated.span>{x.interpolate(val => Math.floor(val))}</animated.span>;
}

NumberAnimation.propTypes = {
  number: number.isRequired
};

NumberAnimation.defaultProps = {
  number: number.isRequired
};
