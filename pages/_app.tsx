import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import styled, { createGlobalStyle } from "styled-components";
import { Box, ChakraProvider } from "@chakra-ui/react";

import Header from "../components/Header";
import { extendTheme } from "@chakra-ui/react";
import Image from "next/image";
import bg from "./bg.jpg";
import React from "react";
import { Footer } from "../components/Footer";

const theme = extendTheme({
  fonts: {
    heading: `'Rubik', sans-serif`,
    body: `'Rubik', sans-serif`,
  },
});

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
  margin-bottom: 6rem;
`;

const BgWrap = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: -1;
`;

const BgImage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <BgWrap>
        <Image
          alt="Mountains"
          src={bg}
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </BgWrap>
      {children}
    </div>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <BgImage>
            <Header />
            <Wrapper>
              <GlobalStyle />
              <Component {...pageProps} />
            </Wrapper>
          </BgImage>
          <Footer />
        </ChakraProvider>
      </SessionProvider>
    </>
  );
};

export default App;
