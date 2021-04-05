import React from "react";
import { Button, propNames } from "@chakra-ui/react";
interface PrimaryButtonProps {
  isLoading?: boolean;
  size?: string;
  fontSize?: string;
  text: string;
  bgColor: string;
  m?: number | string;
  ml?: number | string;
  mt?: number | string;
  mb?: number;
  mr?: number;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  isLoading,
  size,
  fontSize,
  text,
  bgColor,
  type,
  mb,
  mt,
  m,
  ml,
  mr,
  onClick,
}) => {
  return (
    <Button
      isLoading={isLoading}
      textColor="white"
      borderRadius="4px"
      type={type}
      fontWeight="semibold"
      bgColor={bgColor}
      size={size}
      mb={mb}
      mr={mr}
      my={mt}
      ml={ml}
      m={m}
      fontSize={fontSize}
      transition="transform 250ms, opacity 400ms"
      _hover={{
        transform: "scale(1.06)",
        bg: bgColor + "Hover",
      }}
      _active={{
        bg: bgColor + "Hover",
      }}
      _focus={{
        outline: "0",
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
export default PrimaryButton;
