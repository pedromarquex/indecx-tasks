<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A [Nest](https://github.com/nestjs/nest) REST API application that allows users to create, read, update and delete (CRUD) tasks. The application uses a MongoDB database to store the tasks.

## Requirements
- [Node.js](https://nodejs.org/en/) v18 or higher
- [Yarn](https://yarnpkg.com/) to install dependencies
- [Docker](https://www.docker.com/) to build the application
- [Docker Compose](https://docs.docker.com/compose/) to build the application
- [MongoDB](https://www.mongodb.com/) to store the tasks
- [Mongoose](https://mongoosejs.com/) to connect to the database
- [NestJS](https://nestjs.com/) to build the application
- [TypeScript](https://www.typescriptlang.org/) to write the code
- [Swagger](https://swagger.io/) to document the API
- [Insomnia](https://www.insomnia.rest/) to test the API
- [VSCode](https://code.visualstudio.com/) to edit the code
- [Git](https://git-scm.com/) to clone the repository

## Installation

```bash
$ yarn install
```

## Build

We use docker-compose to build the application. You can use the following command to build the application.

```bash
# docker build
$ docker compose up
```

copy the .env.example file to .env and change the values to your own.

```bash
# copy .env.example to .env
$ cp .env.example .env
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run dev

# production mode
$ yarn run start:prod
```

## Swagger

The application uses Swagger to document the API. You can access the Swagger UI by going to http://localhost:3000/docs.

## Insomnia

The application uses Insomnia to test the API. You can import the Insomnia collection by importing the file `indecx-tasks-insomnia.json` into Insomnia.

## Test

```bash
# unit tests with coverage
$ yarn run test

# e2e tests
$ yarn run test:e2e
``````
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
