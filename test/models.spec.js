/**
 * model.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var sinon = require("sinon");
var expect = chai.expect;
var Models = require('../dist/core/model').Models;
var DI = require('../dist/core/di').DI;
var Database = {
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
            var models = Models.create();
            expect(models.db).to.be.eql(Database);
        });
    });
    describe('.add', function () {
        it('adds a new model definition and model to the database', function () {
            Database.model.resetHistory();
            var models = Models.create();
            expect(models.add('Auth', {}, {}, {})).to.not.throw;
            expect(models.models).to.of.length(1);
            var expected = { name: 'Auth', schema: {}, schemaDef: {}, options: {} };
            expect(models.models).to.deep.include(expected);
            expect(Database.model.calledWith(expected.name, expected.schema)).to.be.ok;
        });
    });
    describe('.model', function () {
        it('returns the model', function () {
            Database.model.resetHistory();
            var models = Models.create();
            var model = models.model('Auth');
            expect(Database.model.calledWith('Auth')).to.be.ok;
            expect(model).to.eql({});
        });
    });
    describe('.modelDef', function () {
        it('returns the model definition', function () {
            Database.model.resetHistory();
            var models = Models.create();
            var expected = { name: 'Auth', schema: {}, schemaDef: {}, options: {} };
            models.add('Auth', {}, {}, {});
            expect(models.modelDef('Auth')).to.eql(expected);
            expect(Database.model.calledWith('Auth')).to.be.ok;
        });
    });
});
