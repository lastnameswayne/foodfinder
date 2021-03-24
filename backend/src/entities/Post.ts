import { ObjectType, Field, Int} from "type-graphql";
import {Entity,  BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date();

  @Field()
  @Column()
  text!: string

  @Field()
  @Column({type: "int", default: 0})
  points!: number


  @Field()
  @Column()
  title!: string;

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field()
  @Column()
  creatorId: number

  @Field(() => Int, {nullable: true})
  voteStatus: number | null //1 or -1 or null (null is not voted on yet)
  
}