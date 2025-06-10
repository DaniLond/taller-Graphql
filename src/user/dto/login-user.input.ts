import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  password: string;
}
