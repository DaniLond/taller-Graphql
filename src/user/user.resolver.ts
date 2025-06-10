import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponse } from './types/auth-response.type';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update.user.input';
import { DeleteUserResponse } from './types/delete-user-response.type';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthResponse, { name: 'registerUser' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<AuthResponse> {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => AuthResponse, { name: 'loginUser' })
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthResponse> {
    return this.userService.login(loginUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    if (!currentUser.roles.includes('admin') && currentUser.email !== email) {
      throw new UnauthorizedException('No puedes editar a otros usuarios');
    }

    if (!currentUser.roles.includes('admin')) {
      delete updateUserInput.roles;
      delete updateUserInput.isActive;
    }

    if (currentUser.email !== email) {
      delete updateUserInput.password;
    }

    return this.userService.update(email, updateUserInput);
  }

  @Mutation(() => DeleteUserResponse, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async removeUser(@Args('email') email: string): Promise<DeleteUserResponse> {
    return this.userService.remove(email);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ValidRoles.admin)
  async findOneUser(@Args('email') email: string): Promise<User> {
    return this.userService.findOne(email);
  }

  @Query(() => User, { name: 'profile' })
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  
}
