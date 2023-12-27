import { Status, TaskSchema } from '@/infra/database/schemas/task.schema';
import { UserSchema } from '@/infra/database/schemas/user.schema';
import { faker } from '@faker-js/faker';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
    }).compile();

    const userModule = await Test.createTestingModule({
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

    service = module.get<TasksService>(TasksService);
    usersService = userModule.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await service['taskModel'].deleteMany({});
    await usersService['userModel'].deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('task creation', () => {
    it('should create a task', async () => {
      const userDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const taskDto = {
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        status: Status.PENDING,
      };

      const user = await usersService.create(userDto);

      const task = await service.create(taskDto, user.id);

      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title', taskDto.title);
      expect(task).toHaveProperty('description', taskDto.description);
      expect(task).toHaveProperty('status', taskDto.status);
      expect(task.user.valueOf()).toEqual(user.id);
    });

    it('should throw an error if user not found', async () => {
      const taskDto = {
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        status: Status.PENDING,
      };

      const userId = new mongoose.Types.ObjectId().toHexString();

      await expect(service.create(taskDto, userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if no title is provided', async () => {
      const userDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const taskDto = {
        description: faker.lorem.words(10),
        status: Status.PENDING,
        title: undefined,
      };

      const user = await usersService.create(userDto);

      await expect(service.create(taskDto, user.id)).rejects.toThrow();
    });
  });

  describe('task listing', () => {
    it('should list all tasks', async () => {
      const userDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const taskDto = {
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        status: Status.PENDING,
      };

      const user = await usersService.create(userDto);

      await service.create(taskDto, user.id);

      const tasks = await service.findAll(user.id);

      expect(tasks).toHaveLength(1);
    });

    it('should throw an error if user not found', async () => {
      const userId = new mongoose.Types.ObjectId().toHexString();

      await expect(service.findAll(userId)).rejects.toThrow('User not found');
    });

    it('should return an empty array if no tasks are found', async () => {
      const userDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = await usersService.create(userDto);

      const tasks = await service.findAll(user.id);

      expect(tasks).toHaveLength(0);
    });
  });
});
