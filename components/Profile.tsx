import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Heading } from "@chakra-ui/react";

const Wrapper = styled.div`
  background-color: linear-gradient(#e66465, #9198e5);
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
`;

const StyledContent = styled.div`
  margin-bottom: 2rem;
  text-align: left;
  padding: 1rem;
`;

export function Profile({ name, image, children }) {
  return (
    <Wrapper>
      <Image src={image} alt={name} />
      <Heading size="md">{name}</Heading>
      <StyledContent>{children}</StyledContent>
    </Wrapper>
  );
}
