import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 1rem;
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
`;
