import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
//import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      path: '/graphql',
      context: ({ req }) => ({ req }),
      formatError: (formattedError, error) => {
        if (process.env.NODE_ENV === 'production') {
          return {
            message: formattedError.message,
            locations: formattedError.locations,
            path: formattedError.path,
            extensions: {
              code: formattedError.extensions?.code,
            },
          };
        }
        return formattedError;
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    //ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
