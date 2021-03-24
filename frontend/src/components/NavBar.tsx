import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
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
      <Flex color ="#499D62">
        <Link href="/">FoodFinder</Link>
        <Spacer/>
        <Button bgColor = "transparent" size = "sm">
        <Link href="/register">Register</Link>
        </Button>
        <Button textColor = "white" bgColor = "#499D62" mx = {1} size = "sm">
        <Link href="/login">Login</Link>
        </Button>
      </Flex>
    );
    //user  logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Box ml="auto">
          <Link href="/">FoodFinder</Link>
        </Box>
        <Button
          ml="auto"
          color="white"
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
