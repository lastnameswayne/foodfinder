import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Image,
  Spacer,
  SimpleGrid,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import DetailsFloat from "../components/DetailsFloat";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { MenuSettings } from "../components/MenuSettings";
import { usePostsQuery, PostsQuery, useMeQuery } from "../generated/graphql";
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
          <Button bg="dark" color="white" ml="auto" mb={8}>
            Create post
          </Button>
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
                // bgImage={`url(${p.img})`}
                minW={["100em", "75em", "50em", "15em"]}
                h={["100em", "75em", "50em", "25em"]}
                key={p.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius={20}
                overflow="hidden"
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
            isLoading={loading}
            m="auto"
            my={6}
            bgColor="dark"
            textColor="white"
          >
            Load more!
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
