import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class UsersListResponse {
  @Field(() => [User])
  users: User[];

}
