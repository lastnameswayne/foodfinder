import {
  Box,
  Button,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { SetStateAction, useCallback, useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import PrimaryButton from "../components/PrimaryButton";
import EmojiTags from "../components/EmojiTags";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/canvasUtils";
import { useMutation } from "@apollo/client";
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
    { value: "🥗", label: "🥗 Ready Meals" },
    { value: "🥕", label: "🥕 Fresh vegetables" },
    { value: "🥚", label: "🥚 Eggs and diary" },
    { value: "🥩", label: "🥩 Meat" },
    { value: "🍏", label: "🍏 Fruit" },
  ];

  const [upload] = useMutation(uploadFileMutation);
  const [createPost] = useCreatePostMutation();
  const [showCrop, setShowCrop] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState("");
  const [croppedImage, setCroppedImage] = useState<Object>();
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const router = useRouter();

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e: any) => {
    setShowCrop(true);
    const file = e;
    let imageDataUrl: any = await readFile(file);

    setImageSrc(imageDataUrl);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      blobToFile(croppedImage, `${Date.now()}`);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const blobToFile = (dataurl: any, fileName: string) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const result = new File([u8arr], fileName, { type: mime });
    setFileToUpload(result);
    setShowCrop(false);
  };

  const onDrop = useCallback(
    ([file]) => {
      console.log([file]);
      console.log("single file", file);
      console.log("file 0:", file[0]);
      // setFileToUpload(file);
      onFileChange(file);
    },
    [upload]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useIsAuth();
  const InputDrop = () => {
    if (fileToUpload) {
      return <Text>📷 ✅</Text>;
    } else if (isDragActive) {
      return <Text>Drop the image here</Text>;
    } else {
      return (
        <Text>
          Drag 'n' drop your image here, or just click to select an image🍎
        </Text>
      );
    }
  };

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "", emojiselect: [""] }}
        onSubmit={async (values, { setErrors }) => {
          console.log(fileToUpload);

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
            router.replace("/").then(() => router.reload());
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
                placeholder="description, contact info, location"
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
              <InputDrop></InputDrop>
            </Box>
            <Box width="100%" height="200" background="#333">
              {showCrop ? (
                <>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={15 / 25}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                  <Button
                    onClick={() => setShowCrop(false)}
                    bgColor="🥩Hover"
                    textColor="white "
                    mr={2}
                  >
                    Cancel
                  </Button>
                  <Button
                    bgColor="green"
                    textColor="white"
                    onClick={() => showCroppedImage()}
                  >
                    Crop
                  </Button>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    zIndex="1"
                    aria-labelledby="Zoom"
                    onChange={(zoom: number) => setZoom(zoom)}
                    aria-label="slider-ex-1"
                    defaultValue={0}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </>
              ) : (
                ""
              )}
            </Box>
            {showCrop ? (
              ""
            ) : (
              <PrimaryButton
                bgColor="dark"
                type="submit"
                isLoading={isSubmitting}
                text="New post"
              ></PrimaryButton>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
