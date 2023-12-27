import { AppModule } from '@/app.module';
import { Status } from '@/infra/database/schemas/task.schema';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://docker:docker@localhost:27017/tasks-app-test?authSource=admin',
        ),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Server status', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Users creation', () => {
    it('should create a user', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('name', user.name);
          expect(response.body).toHaveProperty('email', user.email);
        });
    });

    it('should not create a user with an existing email', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an invalid email', async () => {
      const user = {
        name: faker.person.firstName(),
        email: 'invalid-email',
        password: faker.internet.password(),
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an invalid password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an empty name', async () => {
      const user = {
        name: '',
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an empty email', async () => {
      const user = {
        name: faker.person.firstName(),
        email: '',
        password: faker.internet.password(),
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an empty password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a user with an empty name, email and password', async () => {
      const user = {
        name: '',
        email: '',
        password: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Users authentication', () => {
    it('should authenticate a user', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('token');
        });
    });

    it('should not authenticate a user with an invalid email', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'invalid-email',
          password: user.password,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not authenticate a user with an invalid password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: '123',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not authenticate a user with an empty email', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: '',
          password: user.password,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not authenticate a user with an empty password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: '',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not authenticate a user with an empty email and password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: '',
          password: '',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not authenticate a user with an invalid email and password', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'invalid-email',
          password: '123',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Users profile', () => {
    it('should get a user profile', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      return request(app.getHttpServer())
        .get(`/users/me`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('name', user.name);
          expect(response.body).toHaveProperty('email', user.email);
        });
    });

    it('should not get a user profile without a token', async () => {
      return request(app.getHttpServer())
        .get(`/users/me`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not get a user profile with an invalid token', async () => {
      return request(app.getHttpServer())
        .get(`/users/me`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not get a user profile with an expired token', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      return request(app.getHttpServer())
        .get(`/users/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not get a user profile with a token from a deleted user', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      await request(app.getHttpServer())
        .delete(`/users/${body.user._id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/users/me`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Users update', () => {
    it('should update a user profile', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const userToUpdate = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };

      return request(app.getHttpServer())
        .patch(`/users/${body.user._id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .send(userToUpdate)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('name', userToUpdate.name);
          expect(response.body).toHaveProperty('email', userToUpdate.email);
        });
    });

    it('should not update a user profile without a token', async () => {
      return request(app.getHttpServer())
        .patch(`/users/invalid-id`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not update a user profile with an invalid token', async () => {
      return request(app.getHttpServer())
        .patch(`/users/invalid-id`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Tasks creation', () => {
    it('should create a task', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${body.token}`)
        .send(task)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('description', task.description);
          expect(response.body).toHaveProperty('title', task.title);
          expect(response.body).toHaveProperty('status', Status.PENDING);
        });
    });

    it('should not create a task without a token', async () => {
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .send(task)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not create a task with an invalid token', async () => {
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer invalid-token`)
        .send(task)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should create a task with an empty description', async () => {
      const task = {
        description: '',
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${body.token}`)
        .send(task)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('description', task.description);
          expect(response.body).toHaveProperty('title', task.title);
          expect(response.body).toHaveProperty('status', Status.PENDING);
        });
    });

    it('should not create a task with an empty title', async () => {
      const task = {
        description: faker.lorem.sentence(3),
        title: '',
        status: Status.PENDING,
      };

      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      return request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${body.token}`)
        .send(task)
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Tasks list', () => {
    it('should list tasks', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task)
        .expect(201);

      const { body } = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty('_id');
      expect(body[0]).toHaveProperty('description', task.description);
      expect(body[0]).toHaveProperty('title', task.title);
      expect(body[0]).toHaveProperty('status', Status.PENDING);
    });

    it('should not list tasks without a token', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not list tasks with an invalid token', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should list tasks with an empty token', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer `)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Tasks update', () => {
    it('should update a task', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(taskToUpdate)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty(
            'description',
            taskToUpdate.description,
          );
          expect(response.body).toHaveProperty('title', taskToUpdate.title);
          expect(response.body).toHaveProperty('status', Status.DONE);
        });
    });

    it('should not update a task without a token', async () => {
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      return request(app.getHttpServer())
        .patch(`/tasks/invalid-id`)
        .send(taskToUpdate)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not update a task with an invalid token', async () => {
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      return request(app.getHttpServer())
        .patch(`/tasks/invalid-id`)
        .set('Authorization', `Bearer invalid-token`)
        .send(taskToUpdate)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not update a task with an invalid id', async () => {
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const invalidId = new mongoose.Types.ObjectId().toHexString();

      return request(app.getHttpServer())
        .patch(`/tasks/${invalidId}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(taskToUpdate)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not update a task from a deleted user', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task);

      await request(app.getHttpServer())
        .delete(`/users/${loginBody.user._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`);

      return request(app.getHttpServer())
        .patch(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(taskToUpdate)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not update a task from a deleted task', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };
      const taskToUpdate = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.DONE,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        });

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task);

      await request(app.getHttpServer())
        .delete(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`);

      return request(app.getHttpServer())
        .patch(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(taskToUpdate)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  describe('Tasks retrieve', () => {
    it('should retrieve a task', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body).toHaveProperty('description', task.description);
          expect(response.body).toHaveProperty('title', task.title);
          expect(response.body).toHaveProperty('status', Status.PENDING);
        });
    });

    it('should not retrieve a task without a token', async () => {
      return request(app.getHttpServer())
        .get(`/tasks/invalid-id`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task with an invalid token', async () => {
      return request(app.getHttpServer())
        .get(`/tasks/invalid-id`)
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task with an invalid id', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const invalidId = new mongoose.Types.ObjectId().toHexString();

      return request(app.getHttpServer())
        .get(`/tasks/${invalidId}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task from a deleted user', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/users/${loginBody.user._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task from a deleted task', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody.token}`)
        .send(task)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(204);

      return request(app.getHttpServer())
        .get(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task from another user', async () => {
      const user1 = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const user2 = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const task = {
        description: faker.lorem.sentence(3),
        title: faker.lorem.sentence(),
        status: Status.PENDING,
      };

      await request(app.getHttpServer()).post('/users').send(user1).expect(201);
      await request(app.getHttpServer()).post('/users').send(user2).expect(201);

      const { body: loginBody1 } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user1.email,
          password: user1.password,
        })
        .expect(200);

      const { body: loginBody2 } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user2.email,
          password: user2.password,
        })
        .expect(200);

      const { body: taskBody } = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${loginBody1.token}`)
        .send(task)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/tasks/${taskBody._id}`)
        .set('Authorization', `Bearer ${loginBody2.token}`)
        .expect(403)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });

    it('should not retrieve a task with an invalid id', async () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer()).post('/users').send(user).expect(201);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const invalidId = new mongoose.Types.ObjectId().toHexString();

      return request(app.getHttpServer())
        .get(`/tasks/${invalidId}`)
        .set('Authorization', `Bearer ${loginBody.token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });
});
