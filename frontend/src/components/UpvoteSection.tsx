import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import gql from "graphql-tag";
import React from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [vote] = useVoteMutation();

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => {
              const data = cache.readFragment({
                id: 'Post:'+post.id,
                fragment: gql`
                fragment _ on Post {
                  id 
                  points
                  voteStatus
                }
                `,
              })
            },
          });
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="upvote"
        icon={<TriangleUpIcon />}
      />
      <Text>{post.points}</Text>
      <IconButton
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          await vote({ variables: { postId: post.id, value: -1 } });
        }}
        aria-label="downvote"
        icon={<TriangleDownIcon />}
      />{" "}
    </Flex>
  );
};
