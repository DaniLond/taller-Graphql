import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @Field()
  @IsString()
  fullName: string;
}
