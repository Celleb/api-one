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
import * as express from 'express';
import { Router } from 'express';
const expect = chai.expect;

const RouteController = require('../dist/core').RouteController;
const Model = require('../dist/core').Model;
const getModel = require('../dist/model.mock').getModel;

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


const _model = getModel(mainData);

const modelOptions = {
    name: 'users',
    schemaDef: {},
    options: {
        dictionary
    }
};


function createRouter(rc?) {

    return RouteController.create(rc || routeConfig, Model.create(_model, modelOptions, config));
}

describe('RouteController', function () {

    describe('#create', function () {
        it('creates a new Router', function () {
            const rc = createRouter();

            expect(rc).to.be.a('function');
        });
    });
});