import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Heading } from "@chakra-ui/react";
import { Spacer } from "./lib/Spacer";

const Wrapper = styled.div`
  background-color: linear-gradient(#e66465, #9198e5);
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
      <Image src={image} alt={name} />
      <Spacer multiply={0.5} />
      <Heading size="md">{name}</Heading>
      <Spacer multiply={0.5} />
      <StyledContent>{children}</StyledContent>
    </Wrapper>
  );
}
