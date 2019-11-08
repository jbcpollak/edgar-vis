
## Description

An Example of pulling data from the SEC EDGAR database.

This repository is built with NestJS, Typescript and other libraries. It currently uses sec-api.io to look up 10-Q reporting information, then downloads the .txt files directly from the SEC.

From there it extracts the XBRL files from the .txt, parses it and reports some basic information.

Given more time things that would be interesting to add:

- Persisting XBRL data to the sqlite database
- Using cached local XBRL data if available
- More rigorous auditing (date retrieved, user if there was authentication, etc)
- More flexible query parameters
- Unit Tests and ESLint Rules

## Running the Demo

First, make sure you are using node 12.13.0 or higher. I recommend using nodenv.

Then:

```bash
$ npm install
$ npm run start:dev
```

In a web browser go to `http://localhost:3000/ticker/AAPL`

You should see output like:

```
{"tickerSymbol":"AAPL","results":{"2016-Q3":{"equity":126541000000},"2016-Q2":{"equity":130457000000},"2016-Q1":{"equity":128267000000}}}
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
