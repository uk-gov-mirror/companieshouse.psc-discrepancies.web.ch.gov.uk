
# Node.js Web Starter for Team Creed

This web-starter is designed to allow you to very quickly create a Node.js UI web app. It provides you with the essential building blocks (or scaffolding) for piecing together a Node.js UI app and to dictate your overall project structure.


## Downloading and installing

Having cloned the project into your project root, run the following commands:
```
cd node-web-starter
npm install && npm install mocha -g
```


### Config set-up

- The web-starter uses environment variables for configuration.
- The config file is located at `config/.env.example` and should be copied over to `config/.env`. This is because `.env.example` is versioned and does not contain any sensitive information whereas `.env` (which is the actual config file used by the app) is not versioned due to the fact that this is where you store your sensitive application information e.g passwords, certificate paths, API keys, etc...
- You will need to tweak some values in `.env` to suit your local set up e.g. port number, hostname, SSL settings, etc...


### SSL set-up

- If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.
- In a typical production environment, this might never be required as the Node app usually sits


### Testing

To run the tests, type the following command:
```
npm test
```
For these tests, I've used [Mocha](http://mochajs.org/) with [Sinon](http://sinonjs.org/) and [Chai](http://chaijs.com/).


### Running the app

To start the application, run:
```
npm start
```
or, to watch for changes with auto restart in your dev environment, run:
```
npm run watch
```
...and navigate to http://localhost:3000/ (or whatever hostname/port number combination you've changed the config values to)

For SSL connections, navigate to https://localhost:3443


### Empty directories and files

Empty directories and files, wherever you find them, are only there for completeness -- to showcase a folder structure that you should use.


## To-do

- [] Revise linting rule-set
- [] Add pre-commit GIT hooks
- [] Lock down major dependencies to specific versions that are proven to work well
- [] Repurpose web-starter for Typescript

## General notes

 ### 1. Application architecture

- We have opted for the Model-View-Controller design pattern that provides a clear separation of concerns, if executed correctly. This ensures that the task of scaling to a very large codebase with a small or large team(s) remains simple , transparent and causes no source bloat.
- There's  a router where all controller dispatch is handled and requests are fed to the pertinent controllers.
- This approach could be further improved by introduction a concept of "atomic" actions/handlers where all controller logic will be neatly tucked away in separate modules without crowding out the primary controller file. It also means that different developers can work on the similarly grouped tasks in the same controller  with little or no versioning conflicts!
- A similar approach to this is controller helpers which contain routines and methods that you'd rather have obscured from the primary controller file. Controller helpers can be found in the utils sub-folder within the main controllers folder.
- For this web-starter, controllers have been renamed to `routes` and controller-actions are `route handlers` or quite simply `handlers`. This is so we're in sync with the Node.js/Express.js terminology.


### 2. Unit testing

- This starter kit uses Mocha, Chai and Sinon which have long been the gold standard for writing tests for Node.js apps. Another decent option is [Jest](https://jestjs.io).
