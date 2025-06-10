import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { DeleteProductResponse } from './types/product-response.type';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { RolesGuard } from '../user/guards/roles.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { ValidRoles } from '../user/enums/valid-roles.enum';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/user/decorators/roles.decorator';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product, {
    name: 'createProduct',
    description: 'Create a new product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.create(createProductInput);
  }

  @Query(() => [Product], {
    name: 'products',
    description: 'Get all active products with pagination',
  })
  async findAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, {
    name: 'product',
    description: 'Get a product by name',
  })
  async findOneProduct(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Product> {
    return this.productService.findOne(name);
  }

  @Query(() => Product, {
    name: 'productById',
    description: 'Get a product by ID',
  })
  async findOneProductById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Product> {
    return this.productService.findOneById(id);
  }

  @Mutation(() => Product, {
    name: 'updateProduct',
    description: 'Update a product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.update(updateProductInput);
  }

  @Mutation(() => DeleteProductResponse, {
    name: 'deleteProduct',
    description: 'Delete a product',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async removeProduct(
    @Args('name', { type: () => String }) name: string,
    @CurrentUser() user: User,
  ): Promise<DeleteProductResponse> {
    return this.productService.remove(name);
  }
}
