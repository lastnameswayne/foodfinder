import { gql, useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { MenuSettings } from "../components/MenuSettings";
import PrimaryButton from "../components/PrimaryButton";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
//restart

console.log(process.env.NEXT_PUBLIC_API_URL);

const Index = () => {
  const tags = ["🥚", "🍏", "🥗", "🧅", "🍞", "🥕", "🥩", "🥫", "ALL"];
  const [searchTag, setSearchTag] = useState("");
  const { data: meData } = useMeQuery();
  const { data, loading, fetchMore, variables, refetch } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return <div>No posts available.</div>;
  }

  const milisecondsToDays = (ms: number) => {
    const days = ms / 1000 / (24 * 60 * 60);
    if (days < 1) return "today";
    else {
      return days.toPrecision(1) + " days ago";
    }
  };

  const handleSetSearchTag = (p: string) => {
    if (p === "ALL") {
      setSearchTag("");
    } else {
      setSearchTag(p);
    }
  };

  return (
    <Layout>
      <Flex>
        <Box>
          <Heading>Latest Finds</Heading>
          {tags.map((p) => {
            return (
              <Button
                size="sm"
                bgColor={p}
                textColor="white"
                mr={1}
                mt={2}
                mb={6}
                onClick={() => handleSetSearchTag(p)}
                key={p}
                _hover={{
                  bgColor: `${p}Hover`,
                }}
              >
                {p}
              </Button>
            );
          })}
        </Box>
        <Spacer />
        <NextLink href="/create-post">
          <PrimaryButton bgColor="dark" mb={8} text="New post"></PrimaryButton>
        </NextLink>
      </Flex>
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <SimpleGrid columns={[1, 1, 2, 3, 3]} spacing={8}>
          {data!.posts.posts
            .filter((w) => w.tags.includes(searchTag))
            .map((p) =>
              !p ? null : (
                <Flex
                  backgroundSize="contain"
                  style={{
                    background: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0)), url(${p.img})`,
                    backgroundSize: "contain",
                  }}
                  transition="transform 250ms, opacity 400ms"
                  _hover={{
                    transform: "scale(1.06)",
                  }}
                  minW={["60em", "45em", "30em", "15em"]}
                  h={["100em", "75em", "50em", "25em"]}
                  key={p.id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius={20}
                  overflow="hidden"
                  mb={6}
                >
                  <Box textColor="white" flex={1}>
                    <Flex>
                      <Link>
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </NextLink>
                      </Link>
                      <Spacer />
                      {meData?.me?.id !== p.creator.id ? null : (
                        <MenuSettings id={p.id}></MenuSettings>
                      )}
                    </Flex>
                    <Flex>
                      <Text>by {p.creator.username} </Text>
                      <Spacer />
                      <Text>
                        {milisecondsToDays(Date.now() - parseInt(p.createdAt))}
                      </Text>
                    </Flex>
                    {/* <Text mt={4}>{p.textSnippet}</Text> */}
                  </Box>
                </Flex>
              )
            )}
        </SimpleGrid>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                //     updateQuery: (previousValue, {fetchMoreResult}): PostsQuery => {
                //       if (!fetchMoreResult) {
                //         return previousValue as PostsQuery }
                //     return {
                //       _typename: 'Query',
                //       posts: {
                //         __typename: "PaginatedPosts",
                //         hasMore: (fetchMoreResult PostsQuery).posts.hasMore,
                //         posts: [
                //           ...(previousValue as PostsQuery).posts.posts,
                //           ...(fetchMoreResult as PostsQuery).posts.posts
                //         ]
                //       },
                //     };
                //   });
                // }}
              });
            }}
            variant="outline"
            isLoading={loading}
            m="auto"
            colorScheme="#484D6D"
            _hover={{
              transform: "scale(1.06)",
              color: "darkHover",
            }}
            _active={{
              color: "darkHover",
            }}
            _focus={{
              outline: "0",
            }}
          >
            Load more!
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: false })(Index);
