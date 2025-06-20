import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteUserResponse {
  @Field()
  message: string;
}
