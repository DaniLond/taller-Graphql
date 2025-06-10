import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductCategories } from '../enums/valid-categories.enum';

// Registrar el enum para GraphQL
registerEnumType(ProductCategories, {
  name: 'ProductCategories',
  description: 'Product categories available',
});

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID, {
    description: 'Product unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, {
    description: 'Product name',
  })
  @Column('text')
  name: string;

  @Field(() => String, {
    description: 'Product description',
  })
  @Column('text')
  description: string;

  @Field(() => Float, {
    description: 'Product price',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Boolean, {
    description: 'Indicates whether the product is active',
    defaultValue: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @Field(() => ProductCategories, {
    description: 'Product category',
  })
  @Column({
    type: 'enum',
    enum: ProductCategories,
    default: ProductCategories.burgers,
  })
  category: ProductCategories;

  @Field(() => String, {
    description: 'Product image URL',
    nullable: true,
  })
  @Column('text', { nullable: true })
  imageUrl?: string;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.name = this.name.trim();
    if (this.imageUrl) {
      this.imageUrl = this.imageUrl.trim();
    }
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
