import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from '@/infra/database/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, ...rest } = createUserDto;

    const userAlreadyExists = await this.userModel.findOne({ email });

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

    const createdUser = await this.userModel.create({
      email,
      password: passwordHash,
      ...rest,
    });

    createdUser.password = undefined;

    return {
      createdUser,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const userExists = await this.userModel.findOne({ email });

    if (!userExists) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) {
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
    const user = await this.userModel.findById(userId);

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

    const userAlreadyExists = await this.userModel.findOne({ email });

    if (userAlreadyExists && userAlreadyExists.id !== id) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        email,
        name,
      },
      { new: true },
    );

    updatedUser.password = undefined;

    return {
      updatedUser,
    };
  }

  async remove(id: string, userId: string) {
    if (id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
