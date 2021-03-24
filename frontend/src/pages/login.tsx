import { Box, Button, Flex, Link, Spacer } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";
interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();

  const [login] = useLoginMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ 
            variables: values, 
            update: (cache, {data}) => {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: 'Query',
                me: data?.login.user
              }
            });
            cache.evict({fieldName: "posts:{}"});
          },
        });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or Email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Box>
              <NextLink href="/forgot-password">forgot password?</NextLink>
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Login
            </Button>
            <Spacer/>
            <Link>
            <NextLink href="/register">don't have an account?</NextLink>
            </Link>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default withApollo({ ssr: false })(Login);