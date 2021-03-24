import { FieldError } from "../generated/graphql";

export const toErrorMap = (erorrs: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  erorrs.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
