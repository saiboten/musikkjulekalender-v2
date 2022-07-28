import React, { ReactNode } from "react";
import Header from "./Header";
import styled from "styled-components";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  padding: 1rem;
`;

const InnerWrapper = styled.div`
  padding: 1rem 0;
`;

const Layout: React.FC<Props> = (props) => (
  <Wrapper>
    <Header />
    <InnerWrapper>{props.children}</InnerWrapper>
  </Wrapper>
);

export default Layout;
