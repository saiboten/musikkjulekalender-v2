import { keyframes } from "styled-components";

export const backgroundSnow = keyframes`
  0% {
    background-position: 0px 0px, 0px 0px, 0px 0px;
  }
  50% {
    background-position: 500px 500px, 100px 200px, -100px 150px;
  }
  100% {
    background-position: 500px 1000px, 200px 400px, -100px 300px;
  }
`;
