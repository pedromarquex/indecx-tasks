import { AppModule } from '@/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('Users (e2e)', () => {
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
});
