import styled from "styled-components";
import { PrimaryRed } from "./constants";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 2.5rem;
  margin: 2rem;
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
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;
