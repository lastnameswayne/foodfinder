import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const intId = useGetIntId();

  return usePostQuery({
    variables: {
      id: intId,
    },
  });
};
