import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductResponse {
  @Field(() => String, {
    description: 'Success message',
  })
  message: string;
}

@ObjectType()
export class ProductResponse {
  @Field(() => String, {
    description: 'Response message',
  })
  message: string;

  @Field(() => Boolean, {
    description: 'Success status',
  })
  success: boolean;
}
