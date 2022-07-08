import styled from "styled-components";
import { secondaryColor, contrastColor } from "../userresults/colors";

export const StyledLink = styled.a`
  &:visited,
  &:link {
    color: black;
    text-decoration: none;
  }
  padding: 1rem;
  margin: 1rem;
  border-bottom: 2px solid ${secondaryColor};
  display: inline-block;

  &:hover {
    border-color: ${contrastColor};
  }
`;

export const StyledLinkAlternate = styled(StyledLink)`
  &:visited,
  &:link {
    color: #fff;
    text-decoration: none;
  }

  border-bottom: 2px solid #fff;
`;
