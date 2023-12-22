import { PrismaModule } from '@/infra/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        PrismaModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user creation', () => {
    it('should create a user', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
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

      await service.create({
        ...userDto,
      });

      await expect(
        service.create({
          ...userDto,
        }),
      ).rejects.toThrow();
    });
  });

  describe('user authentication', () => {
    it('should authenticate a user', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
        ...userDto,
      });

      const authResponse = await service.login({
        email: user.email,
        password: userDto.password,
      });

      expect(authResponse).toBeDefined();
      expect(authResponse.token).toBeDefined();
      expect(authResponse.user).toBeDefined();

      expect(authResponse.user).toHaveProperty('id');
      expect(authResponse.user).toHaveProperty('email', userDto.email);
      expect(authResponse.user).toHaveProperty('name', userDto.name);
    });

    it('should throw an error if user does not exist', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      await expect(
        service.login({
          email: userDto.email,
          password: userDto.password,
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password does not match', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      await service.create({
        ...userDto,
      });

      await expect(
        service.login({
          email: userDto.email,
          password: faker.internet.password(),
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if email is not provided', async () => {
      await expect(
        service.login({
          email: '',
          password: faker.internet.password(),
        }),
      ).rejects.toThrow();
    });
  });
});
