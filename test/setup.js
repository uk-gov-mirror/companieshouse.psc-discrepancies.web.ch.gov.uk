'use strict';
const path = require('path');

const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const expect = require('chai').expect;
const envVars = require('./env');

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(sinonChai);

// Expose all test libraries to app modules
global.sinon = sinon;
global.chai = chai;
global.should = should;
global.chaiAsPromised = chaiAsPromised;
global.expect = expect;
global.request = chai.request;

global.testRoot = __dirname;
global.appRoot = path.join(__dirname, './../app');
global.serverRoot = path.join(__dirname, './../server');

envVars.setVars();
