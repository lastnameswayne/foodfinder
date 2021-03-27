import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Layout } from "../components/Layout";
import { MenuSettings } from "../components/MenuSettings";
import PrimaryButton from "../components/PrimaryButton";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
//restart

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 3,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return <div>No posts available.</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading>Latest Finds</Heading>
        <NextLink href="/create-post">
          <PrimaryButton
            bgColor="dark"
            mb={8}
            ml="auto"
            text="Create find"
          ></PrimaryButton>
        </NextLink>
      </Flex>
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <SimpleGrid columns={3} spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex
                style={{
                  background: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0)), url(${p.img})`,
                }}
                transition="transform 250ms, opacity 400ms"
                _hover={{
                  transform: "scale(1.06)",
                }}
                // bgImage={`url(${p.img})`}
                minW={["100em", "75em", "50em", "15em"]}
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
                  <Text>by {p.creator.username}</Text>
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

export default withApollo({ ssr: true })(Index);
