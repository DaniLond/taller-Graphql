import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsPositive,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ProductCategories } from '../enums/valid-categories.enum';

@InputType()
export class CreateProductInput {
  @Field(() => String, {
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field(() => String, {
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float, {
    description: 'Product price',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => ProductCategories, {
    description: 'Product category',
  })
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @Field(() => String, {
    description: 'Product image URL',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl?: string;
}
