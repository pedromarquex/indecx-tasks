import { UserSchema } from '@/infra/database/schemas/user.schema';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await controller['usersService']['userModel'].deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('user creation', () => {
    it('should create a user', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const { createdUser: user } = await controller.create({
        ...userDto,
      });

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', userDto.email);
      expect(user).toHaveProperty('name', userDto.name);
    });

    it('should throw an error if email already exists', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      await controller.create({
        ...userDto,
      });

      await expect(controller.create({ ...userDto })).rejects.toThrow();
    });

    it('should throw an error if email is not valid', async () => {
      const userDto = {
        email: 'notvalidemail',
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      await expect(controller.create({ ...userDto })).rejects.toThrow();
    });

    it('should throw an error if name is not provided', async () => {
      await expect(
        controller.create({
          email: faker.internet.email(),
          name: '',
          password: faker.internet.password(),
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password is not provided', async () => {
      await expect(
        controller.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: '',
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password is less than 6 characters', async () => {
      await expect(
        controller.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: '12345',
        }),
      ).rejects.toThrow();
    });
  });
});
