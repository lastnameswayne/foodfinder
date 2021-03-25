import { Box, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client/react/hooks";

const uploadFileMutation = gql`
  mutation UploadImage($file: Upload!) {
    singleUpload(file: $file)
  }
`;

export const CreatePost: React.FC<{}> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const [fileToUpload, setFileToUpload] = useState();

  const onDrop = useCallback(
    ([file]) => {
      setFileToUpload(file);
    },
    [setFileToUpload]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const router = useRouter();
  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          console.log(fileToUpload);
          const { errors } = await createPost({
            variables: {
              input: {
                title: values.title,
                text: values.text,
              },
              file: fileToUpload,
            },
            update: (cache) => {
              cache.evict({ fieldName: "posts" });
            },
          });
          if (!errors) {
            router.push("/");
          } else {
            console.log(errors);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title of your post"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Box
              borderColor="green"
              mt={4}
              borderStyle="dashed"
              borderWidth="1px"
              borderRadius="lg"
              p={5}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Text>Drop the image here</Text>
              ) : (
                <Text>
                  Drag 'n' drop your image here, or just click to select an
                  image
                </Text>
              )}
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting}>
              Create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
