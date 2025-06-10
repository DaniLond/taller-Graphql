import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UserModule,
  ],
  providers: [ProductResolver, ProductService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
