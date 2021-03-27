import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";
import PrimaryButton from "./PrimaryButton";
interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
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
      <Flex color="green">
        <NextLink href="/">
          <Link fontSize="2xl">FoodFinder</Link>
        </NextLink>
        <Spacer />
        <Button bgColor="transparent" size="sm">
          <NextLink href="/register">
            <Link>Register</Link>
          </NextLink>
        </Button>
        <NextLink href="/login">
          <PrimaryButton bgColor="green" text="Login" size="sm"></PrimaryButton>
        </NextLink>
      </Flex>
    );
    //user  logged in
  } else {
    body = (
      <Flex color="green">
        <Box>
          <Link href="/">
            <Text fontSize="2xl">FoodFinder</Text>
          </Link>
        </Box>
        <Spacer />
        <Button size="sm" mr={2} bgColor="transparent" color="dark">
          {data.me.username}
        </Button>
        <PrimaryButton
          bgColor="green"
          text="Log out"
          size="sm"
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
        ></PrimaryButton>
      </Flex>
    );
  }
  return (
    <Box position="static" zIndex={1} bg="transparent" p={4}>
      <Box>{body}</Box>
    </Box>
  );
};
