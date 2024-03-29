import styled from "styled-components";
import { PrimaryRed } from "./constants";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 3.5rem;
  margin: 3rem;
`;

export const GridItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgb(0 0 0 / 50%) 1px 2px 4px 0px;
  text-align: center;
  position: relative;
  background-color: white;
  color: black;
  aspect-ratio: 1 / 1; /* ↔️ is double the ↕️ */

  /* &:hover {
    transform: scale(1.05);
  } */
`;
