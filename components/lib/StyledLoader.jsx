import * as React from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Spinner } from "./Loading.svg";
import { secondaryColor } from "../userresults/colors";

const rotate = keyframes`
	0% {
        transform: rotate(0deg) scale(0.8);
    }
    50% {
        transform: rotate(180deg) scale(1.2);
    }
    100% {
        transform: rotate(359deg) scale(0.8);
    }
`;

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${secondaryColor};
`;

const StyledSpinner = styled(Spinner)`
  animation: ${rotate} 1s infinite linear;
  height: 9.6rem;
  width: 9.6rem;
  fill: white;
`;

export const StyledLoader = () => (
  <StyledWrapper>
    <StyledSpinner />
  </StyledWrapper>
);
