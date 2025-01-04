<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

This is a simple project to demonstrate how to use the NestJS framework to create a REST API.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

Before running the project, you need to create a `.env` file in the root directory of the project and add the following environment variables: `JWT_SECRET`, `ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC`, `MONGODB_URI`

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
