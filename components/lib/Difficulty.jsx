import React from "react";
import styled from "styled-components";
import { number } from "prop-types";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
  font-size: 1rem;
  flex-direction: column;
`;

const Balls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`;

const Base = styled.span`
  border-radius: 50%;
  height: 2.5rem;
  width: 2.5rem;
  margin-left: 0.5rem;
  position: relative;

  box-shadow: inset 0px 2px 1px #29ce00, inset 0px -4px 0px 2px #16ce00;
  border: 1px solid #c5ff00;
  background-image: linear-gradient(to bottom, #6de381 50%, #0bce00);

  &::after {
    content: "";
    position: absolute;
    top: 0.4rem;
    left: 1.5rem;
    width: 0.25rem;
    height: 0.3rem;
    border-radius: 100%;
    box-shadow: 0 0 10px rgba(250, 250, 250, 0.9), inset 0 0 4px #fdf2f2;
    background-color: #fdf2f2;
    transform: skew(10deg);
    transition: 0.35s ease-in-out;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0.85rem;
    left: 1.6rem;
    width: 0.5rem;
    height: 0.65rem;
    border-radius: 100%;
    box-shadow: 0 0 10px rgba(250, 250, 250, 0.9), inset 0 0 4px #fdf2f2;
    background-color: #fdf2f2;
    transform: skew(2deg);
    transition: 0.35s ease-in-out;
  }
`;

const Filled = styled(Base)`
  background-image: linear-gradient(to bottom, #e36d6d 50%, #ce0000);
  box-shadow: inset 0px 2px 1px #ce0000, inset 0px -4px 0px 2px #ce0000;
  border: 1px solid red;
`;

export function Difficulty({ difficulty }) {
  let list = [];
  for (let i = 0; i < 3; i++) {
    if (i < difficulty) {
      list.push(true);
    } else {
      list.push(false);
    }
  }

  return (
    <Wrapper>
      <Balls>{list.map(el => (el ? <Filled /> : <Base />))}</Balls>
      <span style={{ paddingRight: ".3rem" }}>Vanskelighetsgrad</span>
    </Wrapper>
  );
}

Difficulty.propTypes = {
  difficulty: number
};

Difficulty.defaultProps = {
  difficulty: 1
};
