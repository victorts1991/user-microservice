## Description

A user microservice with Node.js, Nest.js, TypeORM, Kubernetes, CI/CD, unit and e2e tests. [Under construction]

## Installation

```bash
$ npm install
```

## Postgres

Install docker and run the command:

```bash
docker run --name user-microservice-db -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=user-microservice-db -p 5432:5432 -d postgres
```

## Enviroment Variables

Change the file name .env.sample for .env

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests with coverage report
$ npm run test:unit:cov

# e2e tests
$ npm run test:e2e
```

## Docker Compose

None of the above steps are necessary, just the command below:

```bash
$ docker compose up --build
```

Note: If you are running on Windows and get any errors, run your CLI as administrator.

## Swagger

After running the application, access the following url: http://localhost:3000/api

## Steps to deploy in the Cloud

...

## TODO:

- add github actions (unit tests, sonarqube, kubernetes(GCP - GKE), docker push(GCP - 
ARTIFACT REGISTRY), e2e tests);
- update README.md with steps for configuration in AWS;
- add endpoint login with return token JWT;
- add endpoints with auth (details, changedata, delete);
