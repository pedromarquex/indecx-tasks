import { UserSchema } from '@/infra/database/schemas/user.schema';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await service['userModel'].deleteMany({});
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

    it('should throw an error if email is not provided', async () => {
      await expect(
        service.create({
          email: '',
          name: faker.person.fullName(),
          password: faker.internet.password(),
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if name is not provided', async () => {
      await expect(
        service.create({
          email: faker.internet.email(),
          name: '',
          password: faker.internet.password(),
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password is not provided', async () => {
      await expect(
        service.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: '',
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password is shorter than 6 characters', async () => {
      await expect(
        service.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(5),
        }),
      ).rejects.toThrow();
    });

    it('should throw an error if password is longer than 20 characters', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: 'a'.repeat(21),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isLength',
        'password must be between 6 and 20 characters',
      );
    });

    it('should throw an error if email is not valid', async () => {
      const userDto = {
        email: 'invalid-email',
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isEmail',
        'email must be a valid email',
      );
    });

    it('should throw an error if name is shorter than 3 characters', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 'ab',
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isLength',
        'name must be between 3 and 50 characters',
      );
    });

    it('should throw an error if name is longer than 50 characters', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 'a'.repeat(51),
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isLength',
        'name must be between 3 and 50 characters',
      );
    });

    it('should throw an error if name is not a string', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 123,
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isString',
        'name must be a string',
      );
    });

    it('should throw an error if email is not a string', async () => {
      const userDto = {
        email: 123,
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isString',
        'email must be a string',
      );
    });

    it('should throw an error if password is not a string', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: 123,
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isString',
        'password must be a string',
      );
    });

    it('should throw an error if email is not valid', async () => {
      const userDto = {
        email: 'invalid-email',
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(CreateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isEmail',
        'email must be a valid email',
      );
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

  describe('user update', () => {
    it('should update a user', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
        ...userDto,
      });

      const updatedName = faker.person.fullName();

      const updatedUser = await service.updateUser(
        user.id,
        {
          name: updatedName,
        },
        user.id,
      );

      expect(updatedUser).toBeDefined();

      expect(updatedUser).toHaveProperty('_id');
      expect(updatedUser).toHaveProperty('email', userDto.email);
      expect(updatedUser).toHaveProperty('name', updatedName);
    });

    it('should throw an error if user does not exist', async () => {
      await expect(
        service.updateUser(
          'invalid-user-id',
          {
            name: faker.person.fullName(),
          },
          'invalid-user-id',
        ),
      ).rejects.toThrow();
    });

    it('should throw an error if user is not authenticated', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
        ...userDto,
      });

      await expect(
        service.updateUser(
          user.id,
          {
            name: faker.person.fullName(),
          },
          'invalid-user-id',
        ),
      ).rejects.toThrow();
    });

    it('should throw an error if name is shorter than 3 characters', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 'ab',
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(UpdateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isLength',
        'name must be between 3 and 50 characters',
      );
    });

    it('should throw an error if name is longer than 50 characters', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 'a'.repeat(51),
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(UpdateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isLength',
        'name must be between 3 and 50 characters',
      );
    });

    it('should throw an error if name is not a string', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: 123,
        password: faker.internet.password(),
      };

      const userDtoObject = plainToInstance(UpdateUserDto, userDto);

      const errors = await validate(userDtoObject);

      expect(errors.length).toBeGreaterThan(0);

      expect(errors[0].constraints).toHaveProperty(
        'isString',
        'name must be a string',
      );
    });
  });

  describe('user deletion', () => {
    it('should delete a user', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
        ...userDto,
      });

      await service.remove(user.id, user.id);

      await expect(
        service.login({ email: user.email, password: user.password }),
      ).rejects.toThrow();
    });
  });

  describe('user profile', () => {
    it('should get a user profile', async () => {
      const userDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const user = await service.create({
        ...userDto,
      });

      const userProfile = await service.me(user.id);

      expect(userProfile).toBeDefined();

      expect(userProfile).toHaveProperty('_id');
      expect(userProfile).toHaveProperty('email', userDto.email);
      expect(userProfile).toHaveProperty('name', userDto.name);
    });

    it('should throw an error if user does not exist', async () => {
      await expect(service.me('invalid-user-id')).rejects.toThrow();
    });
  });
});
