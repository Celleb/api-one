/**
 * route-controller.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { DI } from 'tsjs-di';
const expect = chai.expect;

const RouteController = require('../dist/core').RouteController;
const Model = require('../dist/core').Model;

const config = {

}

const routeConfig = {
    path: 'test',
    model: 'test',
    methods: ['post', 'get', 'patch']
}

const dictionary = {
    firstName: 'name',
    lastName: 'surname',
    familyTree: {
        _id: 'family',
        members: 'memb'
    }
};
const mainData = {
    firstName: 'Jon',
    lastName: 'Manga',
    familyTree: {
        members: 5
    }
};
const transData = {
    name: 'Jon',
    surname: 'Manga',
    family: {
        memb: 5
    }
};
const findOneAndUpdate = function (query, update) {
    const data = { ...mainData };
    for (let key in update) {
        if (data.hasOwnProperty(key)) {
            data[key] = update[key];
        }
    }
    return Promise.resolve(data);
};
const findOne = function (query, options) {
    return Promise.resolve(mainData);
};
const findOneAndRemove = function (query) {
    return Promise.resolve(mainData);
};
const create = function (docs) {
    return Promise.resolve(docs);
};

const _model = {
    create,
    findOne,
    findOneAndUpdate,
    findOneAndRemove
};

const modelOptions = {
    name: 'users',
    schemaDef: {},
    options: {
        dictionary
    }
};

const Models = {
    model: function () {
        return Model.create(_model, modelOptions);
    }
};

function createController(rc?) {
    DI.clear();
    DI.register([{ provide: 'Config', useValue: config }, { provide: 'Models', useValue: Models }])
    return RouteController.create(rc || routeConfig);
}

describe('RouteController', function () {

    describe('#create', function () {
        it('creates a new instance of RouteController', function () {
            const rc = createController();
            expect(rc).to.be.instanceOf(RouteController);
        });
    });
});