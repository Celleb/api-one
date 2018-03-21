/**
 * model.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;
const Models = require('../dist/core/model').Models;
const Model = require('../dist/core/model').Model;
import { DI } from 'tsjs-di';

const Database = {
    model: sinon.stub().returns({})
};
describe('Models', function () {
    beforeEach(function () {
        DI.clear();
        DI.register({ provide: 'Database', useValue: Database });
    });

    describe('#create', function () {
        it('is a function', function () {
            expect(Models.create).to.be.a('function');
        });
        it('creates an instance of Models', function () {
            expect(Models.create()).to.be.an.instanceOf(Models);
        });
        it('injects Database', function () {
            const models = Models.create();
            expect(models.db).to.be.eql(Database);
        });
    });

    describe('.add', function () {
        it('adds a new model definition and creates and adds the model to the database', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const modelDef = {
                name: 'Auth',
                schema: {},
                schemaDef: {},
                options: {}
            }
            expect(models.add(modelDef)).to.not.throw;
            expect(models.models.size).to.eql(1);
            expect(models.modelDefs.size).to.eql(1);
            expect(Database.model.calledWith('Auth', {})).to.be.ok;
        });

        it('adds a new model definition and model to the database', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const modelDef = {
                name: 'Auth',
                schema: {},
                schemaDef: {},
                options: {}
            }
            const model = Database.model('Auth', {});
            expect(models.add(modelDef, model)).to.not.throw;
            expect(models.models.size).to.eql(1);
            expect(models.modelDefs.size).to.eql(1);
            expect(Database.model.calledWith('Auth', {})).to.be.ok;
        });
    });

    describe('.model', function () {
        it('returns the model', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const modelDef = {
                name: 'Auth',
                schema: {},
                schemaDef: {},
                options: {}
            }
            models.add(modelDef);
            expect(models.model('Auth')).to.be.instanceOf(Model);
        });
    });

    describe('.modelDef', function () {
        it('returns the model definition', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const expected = { name: 'Auth', schema: {}, schemaDef: {}, options: {} };
            const modelDef = {
                name: 'Auth',
                schema: {},
                schemaDef: {},
                options: {}
            }
            models.add(modelDef);
            expect(models.modelDef('Auth')).to.eql(expected);
            expect(Database.model.calledWith('Auth')).to.be.ok;
        });
    });
});

