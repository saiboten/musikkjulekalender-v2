import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  display: block;
  border-radius: 5px;
  margin: 0px auto;
  max-width: 120rem;
`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Wrapper>
        <GlobalStyle />
        <Component {...pageProps} />
      </Wrapper>
    </SessionProvider>
  );
};

export default App;
