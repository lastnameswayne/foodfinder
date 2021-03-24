import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotpasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withApollo } from '../utils/withApollo';



export const ForgotPassword: React.FC<{}> = ({}) => {
        const [complete, setComplete] = useState(false)
        const [forgotPassword] = useForgotpasswordMutation()
        return ( 
        <Wrapper variant="small">
        <Formik
          initialValues={{ email: ""}}
          onSubmit={async (values, { setErrors }) => {
            await forgotPassword({variables: values})
            setComplete(true)
          }}
        >
          {({isSubmitting }) => complete ? <Box>if an account with that email existsts, we sent you en email.</Box> : (
            <Form>
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
                />
              </Box>
              <Button mt={4} type="submit" isLoading={isSubmitting}>
                Forgot password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
      
      )
}

export default withApollo({ssr: false})(ForgotPassword);