# AWS Serverless playground

> AWS Lambda that Pings your Healthcheck HTTP endpoint every weekday at 7:30 AM

[![Build Status](https://circleci.com/gh/willmendesneto/aws-serverless-playground.svg?style=shield)](https://circleci.com/gh/willmendesneto/aws-serverless-playground)
[![Coverage Status](https://coveralls.io/repos/github/willmendesneto/aws-serverless-playground/badge.svg?branch=master)](https://coveralls.io/github/willmendesneto/aws-serverless-playground?branch=master)

[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square)](https://github.com/willmendesneto/aws-serverless-playground/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Watch on GitHub](https://img.shields.io/github/watchers/willmendesneto/aws-serverless-playground.svg?style=social)](https://github.com/willmendesneto/aws-serverless-playground/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/willmendesneto/aws-serverless-playground.svg?style=social)](https://github.com/willmendesneto/aws-serverless-playground/stargazers)


## Frameworks, Libraries and Tools

- NPM as dependency manager;
- Mocha as test framework;
- ESLint as lint tool;
- NYC as code coverage tooling;
- Coveralls for code coverage integration in Pull requests and badge generation;
- Sinon as Standalone test spies, stubs and mocks;
- Proxyquire to overriding dependencies during testing;
- Node-Assert assertion library;
- Pino as logger;
- Node Fetch as HTTP client;


## Quick Start

---

## How to install

### Manual installation

Make sure that you are using the NodeJS version is the same as `.nvmrc` file version. If you don't have this version please use a version manager such as `nvm` or `n` to manage your local nodejs versions.

> Please make sure that you are using NodeJS version 6.10.2

Assuming that you are using `nvm`, please run the commands inside this folder:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
$ npm install
```

In Windows, please install NodeJS using one of these options:

Via `NVM Windows` package: Dowload via [this link](https://github.com/coreybutler/nvm-windows). After that, run the commands:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
$ npm install
```

Via Chocolatey:

```bash
$ choco install nodejs.install -version v8.4.0
```
## NPM Commands

### Component commands

- `npm run serverless`:  abstraction to run [AWS Serverless](https://serverless.com/) commands via NPM. It's used for deployment, for example. More details about the deployment configuration at `Jenkinsfile` file.
- `npm run debug:lambda`:  start lambda function in debug mode. More details on [Serverless AWS - Invoke Local docs page](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/)
- `npm run test`: Running unit tests using MochaJS. You can run the tests in watch mode running the command passing `-w`. EX: `npm run test -- -w`


## Configuration

### Stage (environment)

By default, aws-serverless-playground is run in the stage `staging`, you can pass a stage with the `--stage` option. Avaible stages are:

`production` - production
`staging` - staging

## Running the lambda locally

```bash
npm run debug:lambda -- -f reindex --stage <staging|production>
```

It will start the lambda locally in debug mode, so that you can run and debug your code locally. More details on [Serverless AWS - Invoke Local docs page](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/)


## Logs

You can check if the logs for the lambda and if it's working properly, confirming if the event was triggered with success on your configured logger.


## Deployment

There are 2 different deployment steps for this lambda project by default

> Please make sure you configured your deployment steps after fork/clone this project


### Staging

We are following the master-trunk based application on Git, which means you need to submit a pull request from `master` branch to have your changes applied on Staging environment. As soon as your changes were approved and merged, the Jenkins agent should be triggered automatically and your changes will be available on Staging as soon the deployment task finishes with success.

### Production

This project is using `np` package to publish and deploy to production, which makes things straightforward. EX: `np <patch|minor|major> --no-yarn`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)


## Contribute

For contributions, please follow the instructions in [CONTRIBUTING.md](https://github.com/willmendesneto/aws-serverless-playground/blob/master/CONTRIBUTING.md) file.


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
