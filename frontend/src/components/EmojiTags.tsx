import { Checkbox, Text, CheckboxGroup, HStack } from "@chakra-ui/react";
import React from "react";
import { FieldProps } from "formik";
import Select, { OptionProps } from "react-select";

interface EmojiTagsProps {
  options: Array<any>;
  field: any;
  form: any;
}

const EmojiTags: React.FC<EmojiTagsProps> = ({ options, field, form }) => {
  return (
    <>
      <Select
        isMulti
        width="100px"
        options={options}
        name={field.name}
        value={
          options ? options.find((option) => option.value === field.value) : ""
        }
        onChange={(option: any) => {
          form.setFieldValue(
            field.name,
            option.map((item: any) => item.value)
          );
        }}
        onBlur={field.onBlur}
      />
    </>
  );
};
export default EmojiTags;
