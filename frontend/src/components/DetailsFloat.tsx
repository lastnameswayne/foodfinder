import { Box, Flex, propNames, Text } from "@chakra-ui/react";
import React from "react";
import { TimeIcon, InfoOutlineIcon } from "@chakra-ui/icons";
interface DetailsFloatProps {}

const DetailsFloat: React.FC<DetailsFloatProps> = ({}) => {
  return (
    <Box>
      <Flex p={2} borderRadius={50} bgColor="offWhite">
        <TimeIcon></TimeIcon>
        <InfoOutlineIcon></InfoOutlineIcon>
      </Flex>
    </Box>
  );
};

export default DetailsFloat;
