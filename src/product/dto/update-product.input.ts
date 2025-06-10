import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsPositive,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ProductCategories } from '../enums/valid-categories.enum';

@InputType()
export class UpdateProductInput {
  @Field(() => String, {
    description: 'Product name',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name?: string;

  @Field(() => String, {
    description: 'Product description',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @Field(() => Float, {
    description: 'Product price',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @Field(() => ProductCategories, {
    description: 'Product category',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ProductCategories)
  category?: ProductCategories;

  @Field(() => String, {
    description: 'Product image URL',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl?: string;

  @Field(() => Boolean, {
    description: 'Indicates whether the product is active',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
