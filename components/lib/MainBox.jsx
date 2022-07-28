import styled from "styled-components";

export const StyledMainBox = styled.div`
  padding: 2rem;
  border: 2px solid black;
  text-align: left;
  border-radius: 1rem;
  margin: 5px;
  font-size: 1.5rem;
  background-color: #fff;
  flex: 1;

  @media screen and (max-width: 45rem) {
    width: 100%;
    margin: 0;
    border: 0;
    border-radius: 0;
  }
`;
