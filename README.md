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

# Wany-Project

The wany project is a platform for streaming and downloading games.

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env.local` file, replacing the environment variables from .env with the right values for your development. `.env.local` file example:

```bash
GOGLE_CLIENT_ID=MY_GOOGLE_CLIENT_ID_googleusercontent.com
GOOGLE_CLIENT_SECRET=MY_GOOGLE_CLIENT_SECRET
MAIL_AUTH_HOST=smtp.gmail.com
MAIL_AUTH_USER=my_email@gmail.com
MAIL_AUTH_PASS=my_email_password
MAIL_AUTH_PORT=587
SERVER_URL=http://localhost:8080/
```

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
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Conventional Commits

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>feat</td>
      <td>A new feature</td>
      <td>feat: add payment processing</td>
    </tr>
    <tr>
      <td>fix</td>
      <td>A bug fix</td>
      <td>fix: resolve issue with login</td>
    </tr>
    <tr>
      <td>docs</td>
      <td>Documentation changes</td>
      <td>docs: update readme file</td>
    </tr>
    <tr>
      <td>style</td>
      <td>Changes that do not affect the code's functionality</td>
      <td>style: format code</td>
    </tr>
    <tr>
      <td>refactor</td>
      <td>Code changes that neither fix a bug nor add a feature</td>
      <td>refactor: optimize database queries</td>
    </tr>
    <tr>
      <td>perf</td>
      <td>Performance improvements</td>
      <td>perf: reduce server response time</td>
    </tr>
    <tr>
      <td>test</td>
      <td>Adding missing tests or correcting existing tests</td>
      <td>test: add unit tests for login function</td>
    </tr>
    <tr>
      <td>build</td>
      <td>Changes that affect the build system or external dependencies</td>
      <td>build: upgrade React version</td>
    </tr>
    <tr>
      <td>ci</td>
      <td>Changes to the continuous integration configuration files</td>
      <td>ci: add test coverage report</td>
    </tr>
    <tr>
      <td>chore</td>
      <td>Other changes that do not modify src or test files</td>
      <td>chore: update package dependencies</td>
    </tr>
  </tbody>
</table>

### Conventional Branch Names

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>feature</td>
      <td>A new feature branch</td>
      <td>feature/add-payment-processing</td>
    </tr>
    <tr>
      <td>bugfix</td>
      <td>A branch to fix a bug</td>
      <td>bugfix/resolve-issue-with-login</td>
    </tr>
    <tr>
      <td>hotfix</td>
      <td>A branch to quickly fix a critical bug</td>
      <td>hotfix/fix-crash-on-startup</td>
    </tr>
    <tr>
      <td>release</td>
      <td>A branch for preparing a release</td>
      <td>release/1.0.0</td>
    </tr>
    <tr>
      <td>chore</td>
      <td>A branch for miscellaneous tasks</td>
      <td>chore/update-dependencies</td>
    </tr>
  </tbody>
</table>

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

-   Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
-   Website - [https://nestjs.com](https://nestjs.com/)
-   Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
