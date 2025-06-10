import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('users')
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password?: string;

  @Field()
  @Column('text')
  fullName: string;

  @Field()
  @Column('bool', { default: true })
  isActive: boolean;

  @Field(() => [String])
  @Column('text', {
    array: true,
    default: ['customer'],
  })
  roles: string[];

}
