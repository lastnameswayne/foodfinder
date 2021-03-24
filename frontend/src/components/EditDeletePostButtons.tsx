import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId?: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
    const [deletePost] = useDeletePostMutation();

  return (
    <Box ml="auto">
      <Link href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton icon={<EditIcon />} aria-label="Edit post" />
      </Link>
      <IconButton
        ml={2}
        icon={<DeleteIcon />}
        aria-label="Delete post"
        onClick={() => {
          deletePost({ variables: {id}, update: (cache) => {
            cache.evict({id: "Post:"+id})
          } });
        }}
      />
    </Box>
  );
};
