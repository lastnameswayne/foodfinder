import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";
import Link from "next/link";

interface MenuSettingsProps {
  id: number;
  creatorId?: number;
}

export const MenuSettings: React.FC<MenuSettingsProps> = ({ id }) => {
  const [deletePost] = useDeletePostMutation();
  return (
    <Box textColor="black">
      <Menu>
        <MenuButton
          _hover={{
            bg: "transparent",
            //scale here
          }}
          _active={{
            bg: "transparent",
          }}
          borderRadius="100%"
          textColor="white"
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          size="xs"
          variant="outline"
        />
        <MenuList>
          <MenuItem
            icon={<DeleteIcon />}
            onClick={() => {
              deletePost({
                variables: { id },
                update: (cache) => {
                  cache.evict({ id: "Post:" + id });
                },
              });
            }}
          >
            Delete
          </MenuItem>
          <Link href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <MenuItem icon={<EditIcon />}>Edit</MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </Box>
  );
};
