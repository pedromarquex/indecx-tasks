import { PrismaService } from '@/infra/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, ...rest } = createUserDto;

    const userAlreadyExists = await this.repository.user.findFirst({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 6) {
      throw new HttpException(
        'Password must be at least 6 characters long',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hash(password, 8);

    return this.repository.user.create({
      data: {
        ...rest,
        password: passwordHash,
        email,
      },
    });
  }

  async login(createUserDto: LoginUserDto) {
    const { password, email } = createUserDto;

    const userExists = await this.repository.user.findUnique({
      where: { email },
    });

    const passwordMatch = await compare(password, userExists.password);

    if (!userExists || !passwordMatch) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    userExists.password = undefined;

    const payload = { userId: userExists.id };
    const token = this.jwtService.sign(payload);

    return {
      user: userExists,
      token,
    };
  }

  async me(userId: string) {
    const user = await this.repository.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.password = undefined;

    return {
      user,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, userId: string) {
    if (id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { email, name } = updateUserDto;

    const userAlreadyExists = await this.repository.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists && userAlreadyExists.id !== id) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.repository.user.update({
      where: { id },
      data: {
        email,
        name,
      },
    });
  }

  async remove(id: string, userId: string) {
    if (id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.repository.user.update({
      where: { id },
      data: {
        active: false,
      },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
