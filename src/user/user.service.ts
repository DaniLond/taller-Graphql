import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt.interface';
import { isUUID } from 'class-validator';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update.user.input';
import { AuthResponse } from './types/auth-response.type';
import { DeleteUserResponse } from './types/delete-user-response.type';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<AuthResponse> {
    const { password, ...userData } = createUserInput;

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        user: user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserInput: LoginUserInput): Promise<AuthResponse> {
    const { email, password } = loginUserInput;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        fullName: true,
        isActive: true,
        roles: true,
      },
    });

    if (!user)
      throw new UnauthorizedException(`User with email ${email} not found`);

    if (!bcrypt.compareSync(password, user.password!))
      throw new UnauthorizedException(`Email or password incorrect`);

    delete user.password;
    const token = this.getJwtToken({ id: user.id });

    return {
      user: user,
      token,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'fullName', 'isActive', 'roles'],
    });

    return users;
  }

  async findOne(term: string): Promise<User> {
    let user: User | null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      user = await queryBuilder
        .where('user.email = :email OR user.fullName = :fullName', {
          email: term,
          fullName: term,
        })
        .getOne();
    }

    if (!user)
      throw new NotFoundException(`User with identifier '${term}' not found`);

    return user;
  }

  async update(email: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(email);

    try {
      if (updateUserInput.password) {
        updateUserInput.password = bcrypt.hashSync(
          updateUserInput.password,
          10,
        );
      }

      await this.userRepository.update({ email }, updateUserInput);

      const updatedUser = await this.findOne(email);
      return updatedUser;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(email: string): Promise<DeleteUserResponse> {
    const user = await this.findOne(email);
    await this.userRepository.delete({ email });

    return {
      message: `User ${user.email} deleted successfully`,
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
