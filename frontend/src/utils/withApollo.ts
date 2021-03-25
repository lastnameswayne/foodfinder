import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createWithApollo } from "./createWithApollo";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { createUploadLink } from "apollo-upload-client";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    //@ts-ignore
    link: createUploadLink({
      uri: "http://localhost:4000/graphql",
      headers: {
        cookie:
          (typeof window === "undefined"
            ? ctx.req?.headers.cookie
            : undefined) || "",
      },
      fetch,
      fetchOptions: { credentials: "include" },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });
export const withApollo = createWithApollo(createClient);
