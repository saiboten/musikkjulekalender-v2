import { Box, Heading } from "@chakra-ui/react";
import Image from "next/image";
import styled from "styled-components";
import { HorisontalDraggable } from "./lib/HorisontalDraggable";
import nisse from "../img/julenissetransparent.png";

const StyledHeader = styled.div`
  text-align: left;
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  color: #fff;

  @media screen and (max-width: 45rem) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;
  }
`;

export const MainHeading = () => {
  return (
    <StyledHeader>
      <Heading>Musikkjulekalender 2023!</Heading>
      <HorisontalDraggable>
        <Box
          textAlign="center"
          transition="transform .2s"
          _hover={{ transform: "scale(1.1)" }}
        >
          <Image
            draggable={false}
            src={nisse}
            alt="Rockete julsenisse med gitar"
            width={300}
            height={300}
          />
        </Box>
      </HorisontalDraggable>
    </StyledHeader>
  );
};
