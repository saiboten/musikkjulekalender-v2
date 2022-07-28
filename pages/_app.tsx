import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import Header from "../components/Header";

const GlobalStyle = createGlobalStyle`
html {
      /* font-size: 62.5%; // 1 rem == 10px */
  }
  *,
  *::after,
  *::before {
      margin: 0;
      padding: 0;
      box-sizing: inherit;
  }

  body {
      box-sizing: border-box;
      /* background-color: black; */
      font-family: "Rubik", sans-serif;
  }
`;

const Wrapper = styled.div`
  display: block;
  border-radius: 5px;
  margin: 0px auto;
  max-width: 120rem;
  min-height: 95vh;
`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <Header />
        <Wrapper>
          <GlobalStyle />
          <Component {...pageProps} />
        </Wrapper>
        <Footer />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
