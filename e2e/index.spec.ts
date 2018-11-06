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
app.errorHandler(errorHandler);

// describe('Base Route')

const agent = chai.request.agent(app.app);
before(function () {
    return app.models.model('users').model.remove({});
});
describe('GET users', () => {

    it('gets an empty array as feedback', function () {
        return agent.get('/users')
            .then(function (res) {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.eql([]);
            }).catch(function (err) {
                console.log(err)
                throw err;
            });
    });

    after(function () {
        return app.models.model('users').model.remove({});
    });
});

describe('POST, GET and MODIFY Records', () => {

    describe('POST users', function () {
        it('creates and returns a new user from the database', function () {
            const expected = {
                _id: 1,
                name: 'Jonas',
                lastname: 'Tomanga'
            }
            return agent.post('/users')
                .send({ _id: 1, name: 'Jonas', lastname: 'Tomanga' })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res).to.be.json;
                    expect(res.body).contains(expected);
                    expect(res.body).to.haveOwnProperty('date');
                });
        });

        it('creates and returns a 2nd user from the database', function () {
            const expected = {
                _id: 2,
                name: 'Jon',
                lastname: 'Manga'
            }
            return agent.post('/users')
                .send({ _id: 2, name: 'Jon', lastname: 'Manga' })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res).to.be.json;
                    expect(res.body).contains(expected);
                    expect(res.body).to.haveOwnProperty('date');
                });
        });

        it('produces a conflict error', function () {

            return agent.post('/users')
                .send({ _id: 2, name: 'Jon', lastname: 'Manga' })
                .then(function (res) {
                    expect(res.status).to.eql(409);
                    expect(res).to.be.json;
                    expect(res.body.code).to.eql(409);
                    expect(res.body.name).to.eql('ConflictError');
                    expect(res.body.message).to.eql('This resource/items conflicts with an existing resource or item.');
                });
        });
    });

    describe('GET All users', function () {
        it('gets all users from the database', function () {
            return agent.get('/users').then(function (res) {
                expect(res.status).to.eql(200);
                expect(res).to.be.json;
                expect(res.body).to.an('array');
                expect(res.body).to.be.length(2);
            });
        });
    });

    describe('GET a single user', function () {
        it('get a single user', function () {
            const expected = {
                _id: 2,
                name: 'Jon',
                lastname: 'Manga'
            }
            return agent.get('/users/2').then(function (res) {
                expect(res.status).to.eql(200);
                expect(res).to.be.json;
                expect(res.body).to.an('object');
                expect(res.body).contains(expected);
            });
        });
    });

    describe('PATCH a single user', function () {
        const expected = {
            _id: 2,
            name: 'Leonard',
            lastname: 'Shivute'
        }
        it('modifies a record of a single user', function () {
            return agent.patch('/users/2')
                .send({ name: 'Leonard', lastname: 'Shivute' })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res).to.be.json;
                    expect(res.body).to.an('object');
                    expect(res.body).contains(expected);
                });
        });

        it('confirms the modified record', function () {
            return agent.get('/users/2').then(function (res) {
                expect(res.status).to.eql(200);
                expect(res).to.be.json;
                expect(res.body).to.an('object');
                expect(res.body).contains(expected);
            });
        });


    });

    describe('DELETE a user', function () {

        it('delete a user from the database', function () {
            const expected = {
                _id: 2,
                name: 'Leonard',
                lastname: 'Shivute'
            }
            return agent.del('/users/2').then(function (res) {
                expect(res.status).to.eql(201);
                expect(res.body).to.be.empty;
            });
        });


        it('confirms deletion', function () {
            const expected = {
                _id: 2,
                name: 'Leonard',
                lastname: 'Shivute'
            }
            return agent.get('/users/2').then(function (res) {
                expect(res.status).to.eql(404);
                expect(res).to.be.json;
                expect(res.body.code).to.eql(404);
                expect(res.body.name).to.eql('NotFoundError');
                expect(res.body.message).to.eql('User could not be found.');
            });
        });
    });

    after(function () {
        return app.models.model('users').model.remove({});
    });
});
