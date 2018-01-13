/**
 * schema.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var expect = chai.expect;
var mongoose = require("mongoose");
var Schema = require('../dist/core/model').Schema;
var DI = require('../dist/core/di').DI;
describe('Schema', function () {
    describe('#create', function () {
        it('is a function', function () {
            expect(Schema.create).to.be.a('function');
        });
        it('creates a new instance of Schema', function () {
            DI.clear();
            DI.register({ provide: 'DefaultSchemaOptions', useValue: {} });
            var schema = Schema.create({}, {});
            expect(schema).to.be.an.instanceOf(Schema);
        });
    });
    describe('.getSchema', function () {
        it('returns an instance of mongoose schema', function () {
            DI.clear();
            DI.register({ provide: 'DefaultSchemaOptions', useValue: {} });
            var schema = Schema.create({
                name: { type: String }
            }, { autoIndex: true });
            expect(schema.getSchema()).to.an.instanceOf(mongoose.Schema);
        });
    });
});
