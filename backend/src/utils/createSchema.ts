import { buildSchema } from "type-graphql";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { UserResolver } from "../resolvers/user";

export const createSchema = async () =>
  await buildSchema({
    resolvers: [HelloResolver, PostResolver, UserResolver],
    validate: false,
  });
