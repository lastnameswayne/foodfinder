import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

// import { Storage } from "@google-cloud/storage";
// import path from "path";
// const files = [];
// const gc = new Storage({
//   keyFilename: path.join(__dirname, "../foodfinder-308619-efbc75405f18.json"),
//   projectId: "foodfinder-308619",
// });

//const bucket = gc.bucket("foodfinder");

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() {}: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1; //get one more post to check if there are more left

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
      select p.*
      from post p
      ${cursor ? `where p."createdAt"< $2` : ""}
      order by p."createdAt" DESC
      limit $1
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOne(id);
    if (!post) {
      return false;
    }
    if (post.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }

  // @Mutation(() => Boolean)
  // async singleUpload(@Arg("file", (_) => GraphQLUpload) file: FileUpload) {
  //   const { createReadStream, filename } = await file;
  //   const writableStream = createWriteStream(
  //     `${__dirname}/../../images/${filename}`,
  //     { autoClose: true }
  //   );
  //   let image;
  //   try {
  //     (res: any, rej: any) => {
  //       image = createReadStream()
  //         .pipe(writableStream)
  //         .on("finish", () => res(true))
  //         .on("error", () => rej(false));
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   console.log(image);

  //   return true;
  // }

  @Mutation((returns) => Boolean)
  async singleUpload(
    @Arg("file", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(`${__dirname}/../../images/${filename}`, {
            autoClose: true,
          })
        )
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }

  // @Mutation(() => Boolean)
  // async addProfilePicture(
  //   @Arg("picture", () => GraphQLUpload)
  //   { createReadStream, filename }: Upload
  // ): Promise<boolean> {
  //   return new Promise(async (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
  //       .on("finish", () => resolve(true))
  //       .on("error", () => reject(false))
  //   );
  // }
}
