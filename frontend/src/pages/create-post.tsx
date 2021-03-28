import { Box, Button, Input, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
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
import PrimaryButton from "../components/PrimaryButton";
import EmojiTags from "../components/EmojiTags";
const uploadFileMutation = gql`
  mutation UploadImage($file: Upload!) {
    singleUpload(file: $file)
  }
`;

export const CreatePost: React.FC<{}> = ({}) => {
  const options = [
    { value: "🧅", label: "🧅 Dry vegetables" },
    { value: "🥫", label: "🥫 Canned goods" },
    { value: "🍞", label: "🍞 Bread" },
    { value: "🍕", label: "🍕 Meals" },
    { value: "🥕", label: "🥕 Fresh vegetables" },
    { value: "🥚", label: "🥚 Eggs and diary" },
    { value: "🥩", label: "🥩 Meat" },
    { value: "🍎", label: "🍎 Fruit" },
  ];

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
        initialValues={{ title: "", text: "", emojiselect: [""] }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          console.log(fileToUpload);
          console.log(values.emojiselect);
          console.log(values.emojiselect.join());

          const { errors } = await createPost({
            variables: {
              input: {
                title: values.title,
                text: values.text,
                tags: values.emojiselect.join(),
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
                label="Description"
              />
            </Box>
            <Text fontWeight="semibold">Tags</Text>
            <Field
              name="emojiselect"
              component={EmojiTags}
              options={options}
            />{" "}
            <Text fontWeight="semibold" mt={4}>
              Image
            </Text>
            <Box
              mt={2}
              mb={4}
              borderColor="dark"
              borderStyle="dashed"
              borderWidth="2px"
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
                  image🍎
                </Text>
              )}
            </Box>
            <PrimaryButton
              bgColor="dark"
              type="submit"
              isLoading={isSubmitting}
              text="Post find"
            ></PrimaryButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
