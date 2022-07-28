import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  gap: 2rem;
`;

export const GridItem = styled.div`
  padding: 1rem 1rem 2rem;
  box-shadow: rgb(0 0 0 / 50%) 2px 4px 8px 0px;
  min-height: 20rem;
  margin: 5px;
  text-align: center;
  position: relative;
  background-color: white;
  color: black;
`;
