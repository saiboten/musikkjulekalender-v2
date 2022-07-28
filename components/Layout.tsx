import React, { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
  whiteBg?: boolean;
};

const Wrapper = styled.div<{ whiteBg: boolean }>`
  max-width: 50rem;
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
  <Wrapper whiteBg={props.whiteBg}>
    <InnerWrapper>{props.children}</InnerWrapper>
  </Wrapper>
);

export default Layout;
