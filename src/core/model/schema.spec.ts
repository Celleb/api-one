/**
 * schema.spec.ts
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

import * as mongoose from 'mongoose';
const Schema = require('../dist/core/model').Schema;
const DI = require('../dist/core/di').DI;



describe('Schema', function () {
    describe('#create', function () {
        it('is a function', function () {
            expect(Schema.create).to.be.a('function');
        });

        it('creates a new instance of Schema', function () {
            DI.clear();
            DI.register({ provide: 'DefaultSchemaOptions', useValue: {} });
            const schema = Schema.create({}, {});
            expect(schema).to.be.an.instanceOf(Schema);
        });
    });
    describe('.getSchema', function () {
        it('returns an instance of mongoose schema', function () {
            DI.clear();
            DI.register({ provide: 'DefaultSchemaOptions', useValue: {} });
            const schema = Schema.create({
                name: { type: String }
            }, { autoIndex: true });
            expect(schema.getSchema()).to.an.instanceOf(mongoose.Schema);
        });

    });
});
