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
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { MenuSettings } from "../components/MenuSettings";
import PrimaryButton from "../components/PrimaryButton";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

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
      <Flex flex={1} h="100%">
        <Box>
          <Heading ml={2}>Latest Finds</Heading>
          {tags.map((p) => {
            return (
              <Button
                size="sm"
                bgColor={p}
                textColor="white"
                ml={2}
                mt={2}
                mb={2}
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
          <PrimaryButton
            mr={2}
            bgColor="dark"
            mb={8}
            text="New post"
          ></PrimaryButton>
        </NextLink>
      </Flex>
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <SimpleGrid mt={6} columns={[1, 1, 3, 3]} spacing={8}>
          {data!.posts.posts
            .filter((w) => w.tags.includes(searchTag))
            .map((p) =>
              !p ? null : (
                <Box
                  display="flex"
                  flex={1}
                  style={{
                    background: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0)), url(${p.img})`,
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                  }}
                  transition="transform 250ms, opacity 400ms"
                  _hover={{
                    transform: "scale(1.06)",
                  }}
                  maxW="100%"
                  maxH="100%"
                  w={["23em", "46em", "15em"]}
                  h={["38.333em", "76.666em", "25em"]}
                  key={p.id}
                  p={5}
                  shadow="md"
                  margin="auto"
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
                  </Box>
                </Box>
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
