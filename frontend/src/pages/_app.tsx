import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { PaginatedPosts, PostsQuery } from "../generated/graphql";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <link
          rel="FoodFinder"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/red-apple_1f34e.png"
        />
      </Head>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
