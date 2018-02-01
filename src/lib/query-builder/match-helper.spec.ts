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

    describe('MatchHelper.constructor', function () {
        it('creates a new instance of match builder', function () {
            expect(createMb()).to.be.an.instanceOf(MatchHelper);
        });
    });

    describe('MatchHelper.getKeyAndValues', function () {

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

    describe('MatchHelper.typify', function () {

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
});
