import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Box, Heading } from "@chakra-ui/react";
import { Spacer } from "./lib/Spacer";
import { PrimaryRed } from "./constants";

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  padding: 0.5rem 0;
`;

const StyledContent = styled.div`
  margin-bottom: 2rem;
  text-align: left;
  padding: 0 1rem;
`;

export function Profile({ name, image, children }) {
  return (
    <Wrapper>
      <Box position="relative" display="inline-block">
        <Heading
          size="lg"
          mb="2"
          position="absolute"
          right={{ base: "0px", lg: "-15px" }}
          bottom={{ base: "0px", lg: "-15px" }}
          zIndex="1"
          backgroundColor={PrimaryRed}
          padding="5px"
          color="#fff"
          borderRadius="5px"
          opacity="0.9"
        >
          {name}
        </Heading>

        <Image src={image} alt={name} style={{ borderRadius: "5px" }} />
      </Box>
      <Spacer multiply={0.5} />
      <Spacer multiply={0.5} />
      <StyledContent>{children}</StyledContent>
    </Wrapper>
  );
}
