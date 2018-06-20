/**
 * index.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */


import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
//import * as chaiPromised from 'chai-as-promised';

//chai.use(chaiPromised);
chai.use(chaiHttp);
const expect = chai.expect;

import { App } from '../src/core/app';
import { DatabaseConfig, Config } from '../src/core/types';
import { models } from './models';
import { errorHandler } from '../src/lib/error-handler';
import { TEST_ROUTES } from './test.routes';

const config: Config = {
    name: 'ApiOneE2E',
    dbConfig: {
        name: 'ApiOneTest',
        default: true,
        host: 'localhost',
        port: 27017,
        username: 'ApiOneTest',
        password: 'ApiOneTest',
        authSource: 'admin'
    } as DatabaseConfig
};

const app = new App(config);
app.init(models);
app.createRoutes(TEST_ROUTES);
//app.errorHandler(errorHandler);

// describe('Base Route')

describe('GET users', () => {

    it('responds with JSON array', function () {
        return chai.request(app.app).get('/users')
            .then(function (res) {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            }).catch(function (err) {
                console.log(err)
                throw err;
            });
    });
});