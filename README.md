# snake

A JavaScript implementation of the Snake game.

## Run Game

Run `npm`, the [node package manager](https://www.npmjs.org/), to install dependencies with:

```
npm install
```

Start the local web server with:

```
npm start
```

Navigate with a browser to:

```
http://localhost:8000/app/index.html
```

## Run Tests

The tests are written in [Jasmine](http://jasmine.github.io/), and run with the
[Karma Test Runner](http://karma-runner.github.io/).  The configuration file is found at `karma.conf.js`
and the tests are found in `test/spec`.

The easiest way to run the unit tests is to use the npm script and run:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Karma
will remaining running and re-execute the tests whenever any files change.

You can also have Karma execute the tests once and exit by running:

```
npm run test-single-run
```

Note that only a few tests are currently written for the util.js module for purposes of illustration.
