import styled from "styled-components";
import { contrastColor } from "../userresults/colors";

export const StyledButton = styled.button`
  font-size: 1.2rem;
  padding: 1rem;
  min-width: 7.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  text-align: center;
  text-decoration: none;
  overflow-wrap: break-word;
  border-radius: 5px;
  box-shadow: 0px 2px 8px black;
  background-color: white;
  border: 0;
`;

export const StyledButtonSecondary = styled(StyledButton)`
  box-shadow: none;
  border: none;
  border-radius: 0;
  border-bottom: 2px solid black;
  padding: 0.5rem;

  &:hover {
    border-color: ${contrastColor};
  }

  &:focus {
    outline: 0;
  }
`;
