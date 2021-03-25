import { Box, Button, Flex, Heading, Link, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";
interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient()
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });


  let body = null;

  //data loading...
  if (loading) {
    body = null;
    //user not logged in
  } else if (!data?.me) {
    body = (
      <Flex color ="green">
        <NextLink href="/"><Link fontSize="2xl">FoodFinder</Link></NextLink>
        <Spacer/>
        <Button bgColor = "transparent" size = "sm">
        <NextLink href="/register"><Link>Register</Link></NextLink>
        </Button>
        <Button textColor = "white" bgColor="green" mx = {1} size = "sm">
        <NextLink href="/login">Login</NextLink>
        </Button>
      </Flex>
    );
    //user  logged in
  } else {
    body = (
      <Flex>
        <Box>
          <Link href="/"><Text color ="green" fontSize="2xl">FoodFinder</Text></Link>
        </Box>
        <Spacer/>
        <Button mr={2} bgColor ="transparent" color = "dark">{data.me.username}</Button>
        <Button
          ml="auto"
          textColor="white"
          bgColor="green"
          p={2}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore()
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Log out
        </Button>
      </Flex>
    );
  }
  return (
    <Box position="sticky" top={0} zIndex={1} bg="transparent" p={4} ml={"auto"}>
      <Box ml={"auto"}>{body}</Box>
    </Box>
  );
};
