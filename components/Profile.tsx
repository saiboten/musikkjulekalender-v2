import React from "react";
import styled from "styled-components";
import { H2 } from "./lib/Heading";
import Image from "next/image";

const Wrapper = styled.div`
  background-color: linear-gradient(#e66465, #9198e5);
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
`;

const StyledImage = styled.img`
  width: 100%;
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
      {/* <StyledImage src={image} alt={name} /> */}
      <H2>{name}</H2>
      <StyledContent>{children}</StyledContent>
    </Wrapper>
  );
}
