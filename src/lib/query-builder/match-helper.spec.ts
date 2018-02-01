/**
 * match-builder.spec.ts
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

const expect = chai.expect;

const DI = require('../dist/core/di').DI;
const operators = require('../dist/config').defaultOperators;
DI.clear();
DI.register({ provide: 'Operators', useValue: operators });

const MatchHelper = require('../dist/lib').MatchHelper;


const dictionary = {
    _id: 'id',
    number: 'number',
    firstName: 'name',
    lastName: 'surname',
    family: {
        _id: 'fam',
        name: 'name'
    }
};

const schemaDef = {
    _id: { type: Number },
    number: Number,
    firstName: { type: String },
    lastName: String,
    family: {
        name: { type: String }
    },
    date: { type: Date }
};

function createMb() {
    return new MatchHelper(schemaDef, dictionary);
}

function createMbN() {
    return new MatchHelper(schemaDef);
}

describe('MatchHelper', function () {

    describe('.constructor', function () {
        it('creates a new instance of match builder', function () {
            expect(createMb()).to.be.an.instanceOf(MatchHelper);
        });
    });

    describe('.getKeyAndValues', function () {

        it('extracts the key and value from the specified string and returns an array with the string and value', function () {
            const mb = createMbN();
            const expected = ['name', 'Jonas'];
            expect(mb.getKeyAndValues('name:Jonas', ':')).to.eql(expected);
        });

        it('extracts the key and values from the specified string given a string with a substring of comma seperated values.', function () {
            const mb = createMbN();
            const expected = ['names', ['Jonas', 'Tomanga']];
            const string = 'names=Jonas, Tomanga';
            expect(mb.getKeyAndValues(string, '=')).to.eql(expected);
        });

        it('extracts the key and value from the specified string and returns an array with value and a translated key', function () {
            const mb = createMb();
            const expected = ['firstName', 'Jonas'];
            expect(mb.getKeyAndValues('name:Jonas', ':')).to.eql(expected);
        });
    });

    describe('.typify', function () {

        it('converts the specified value to the correct type based on the SchemaDefinition', function () {
            const mb = createMbN();
            expect(mb.typify('3', 'number')).to.be.a('number');
            expect(mb.typify('3', 'number')).to.not.be.a('string');
            expect(mb.typify('3', '_id')).to.be.a('number');
            expect(mb.typify('2017-01-31', 'date')).to.be.a('date');
        });

        it('converts the specified values in an array to the correct type based on the SchemaDefinition', function (done) {
            const mb = createMbN();
            const values = mb.typify(['3', '7'], 'number');
            values.forEach(value => {
                expect(value).to.be.a('number');
                expect(value).to.not.be.a('string');
            });
            done();
        });

        it('returns other value types as is without conversion', function () {
            const mb = createMbN();
            expect(mb.typify('feeling', 'firstName')).to.be.a('string');
            expect(mb.typify('3', 'firstName')).to.be.a('string');
        });

    });

    describe('.toEqual', function () {
        it('creates and returns an object that specifies an equality condition', function () {
            const mb = createMbN();
            const expected = { name: 'Jonas' };
            expect(mb.equal('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies an equality condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: 3 };
            expect(mb.equal('_id', '3')).to.eql(expected);
        });

        it('creates and returns an object that specifies an equality condition that matches any value in an array', function () {
            const mb = createMbN();
            const expected = { name: { $in: ['Jonas', 'Tomanga'] } };
            expect(mb.equal('name', ['Jonas', 'Tomanga'])).to.eql(expected);
        });
    });

    describe('.notEqual', function () {
        it('creates and returns an object that specifies a not equal condition', function () {
            const mb = createMbN();
            const expected = { name: { $ne: 'Jonas' } };
            expect(mb.notEqual('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies a not equal condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $ne: 3 } };
            expect(mb.notEqual('_id', '3')).to.eql(expected);
        });

        it('creates and returns an object that specifies a not equal condition that matches any value in an array', function () {
            const mb = createMbN();
            const expected = { name: { $nin: ['Jonas', 'Tomanga'] } };
            expect(mb.notEqual('name', ['Jonas', 'Tomanga'])).to.eql(expected);
        });
    });

    describe('.greaterOrEqual', function () {
        it('creates and returns an object that specifies a greater or equal condition', function () {
            const mb = createMbN();
            const expected = { name: { $gte: 'Jonas' } };
            expect(mb.greaterOrEqual('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies a greater or equal condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $gte: 3 } };
            expect(mb.greaterOrEqual('_id', '3')).to.eql(expected);
        });
    });

    describe('.lessOrEqual', function () {
        it('creates and returns an object that specifies a less or equal condition', function () {
            const mb = createMbN();
            const expected = { name: { $lte: 'Jonas' } };
            expect(mb.lessOrEqual('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies a less or equal condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $lte: 3 } };
            expect(mb.lessOrEqual('_id', '3')).to.eql(expected);
        });
    });

    describe('.lessOrGreater', function () {
        it('creates and returns an object that specifies a less or greater condition', function () {
            const mb = createMbN();
            const expected = { name: { $lt: 'Jonas', $gt: 'Tomanga' } };
            expect(mb.lessOrGreater('name', ['Jonas', 'Tomanga'])).to.eql(expected);
        });

        it('creates and returns an object that specifies a less or greater condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $lt: 3, $gt: 4 } };
            expect(mb.lessOrGreater('_id', [3, 4])).to.eql(expected);
        });
    });

    describe('.lessOrGreaterInc', function () {
        it('creates and returns an object that specifies a less or greater inclusive condition', function () {
            const mb = createMbN();
            const expected = { name: { $lte: 'Jonas', $gte: 'Tomanga' } };
            expect(mb.lessOrGreaterInc('name', ['Jonas', 'Tomanga'])).to.eql(expected);
        });

        it('creates and returns an object that specifies a less or greater inclusive condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $lte: 3, $gte: 4 } };
            expect(mb.lessOrGreaterInc('_id', [3, 4])).to.eql(expected);
        });
    });

    describe('.greater', function () {
        it('creates and returns an object that specifies a greater than condition', function () {
            const mb = createMbN();
            const expected = { name: { $gt: 'Jonas' } };
            expect(mb.greater('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies a greater than condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $gt: 4 } };
            expect(mb.greater('_id', '4')).to.eql(expected);
        });
    });

    describe('.less', function () {
        it('creates and returns an object that specifies a less than condition', function () {
            const mb = createMbN();
            const expected = { name: { $lt: 'Jonas' } };
            expect(mb.less('name', 'Jonas')).to.eql(expected);
        });

        it('creates and returns an object that specifies a less than condition (typified)', function () {
            const mb = createMbN();
            const expected = { _id: { $lt: 4 } };
            expect(mb.less('_id', '4')).to.eql(expected);
        });
    });
});
