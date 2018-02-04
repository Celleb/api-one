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
        it('adds a new model definition and model to the database', function () {
            Database.model.resetHistory();
            const models = Models.create();
            expect(models.add('Auth', {}, {}, {})).to.not.throw;
            expect(models.models).to.of.length(1);
            const expected = { name: 'Auth', schema: {}, schemaDef: {}, options: {} };
            expect(models.models).to.deep.include(expected);
            expect(Database.model.calledWith(expected.name, expected.schema)).to.be.ok;
        });
    });

    describe('.model', function () {
        it('returns the model', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const model = models.model('Auth');
            expect(Database.model.calledWith('Auth')).to.be.ok;
            expect(model).to.eql({});
        });
    });

    describe('.modelDef', function () {
        it('returns the model definition', function () {
            Database.model.resetHistory();
            const models = Models.create();
            const expected = { name: 'Auth', schema: {}, schemaDef: {}, options: {} };
            models.add('Auth', {}, {}, {});
            expect(models.modelDef('Auth')).to.eql(expected);
            expect(Database.model.calledWith('Auth')).to.be.ok;
        });
    });
});

