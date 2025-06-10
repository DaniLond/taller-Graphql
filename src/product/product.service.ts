import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductInput);
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(name: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { name, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with name ${name} not found`);
    }

    return product;
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(updateProductInput: UpdateProductInput): Promise<Product> {
    const { name, ...updateData } = updateProductInput;

    const product = await this.productRepository.findOne({ where: { name } });
    if (!product) {
      throw new NotFoundException(`Product with name "${name}" not found`);
    }

    try {
      await this.productRepository.update({ name }, updateData);
      const updatedProduct = await this.productRepository.findOne({
        where: { name },
      });
      if (!updatedProduct) {
        throw new NotFoundException(
          `Product with name "${name}" not found after update`,
        );
      }
      return updatedProduct;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(name: string): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { name } });

    if (!product) {
      throw new NotFoundException(`Product with name "${name}" not found`);
    }

    await this.productRepository.update({ name }, { isActive: false });

    return {
      message: `Product ${product.name} deleted successfully`,
    };
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new BadRequestException('Unexpected error, check server logs');
  }
}
