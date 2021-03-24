import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import React from "react";
import { PaginatedPosts, PostsQuery } from "../generated/graphql";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
      <ChakraProvider resetCSS theme={theme}>
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
