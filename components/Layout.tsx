import React, { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
  whiteBg?: boolean;
  customSize?: number;
};

const Wrapper = styled.div<{ whiteBg: boolean; customSize?: number }>`
  max-width: ${({ customSize }) => (customSize ? customSize : "65")}rem;
  margin: 1rem auto;
  padding: 1rem;
  background-color: ${(props) => (props.whiteBg ? "#fff" : "inherit")};
  border-radius: 2rem;
  opacity: 0.95;
`;

const InnerWrapper = styled.div`
  padding: 1rem 0;
`;

const Layout: React.FC<Props> = (props) => (
  <Wrapper whiteBg={props.whiteBg} customSize={props.customSize}>
    <InnerWrapper>{props.children}</InnerWrapper>
  </Wrapper>
);

export default Layout;
