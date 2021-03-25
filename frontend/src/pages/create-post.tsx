import { Box, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import {
  useCreatePostMutation,
  useUploadImageMutation,
} from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";
import { useDropzone } from "react-dropzone";
import { title } from "process";

export const CreatePost: React.FC<{}> = ({}) => {
  const [uploadFile] = useUploadImageMutation();

  const [fileToUpload, setFileToUpload] = useState();
  const onDrop = useCallback(
    ([file]) => {
      setFileToUpload(file);
      console.log(file);
    },
    [setFileToUpload]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          console.log(fileToUpload);
          const { errors } = await uploadFile(fileToUpload);
          // const { errors } = await createPost({
          //   variables: { input: { title: values.title, text: values.text } },
          //   update: (cache) => {
          //     cache.evict({ fieldName: "posts" });
          //   },
          // });
          if (!errors) {
            router.push("/");
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
