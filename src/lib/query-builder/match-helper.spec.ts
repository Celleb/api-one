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
    _id: { type: String },
    number: Number,
    firstName: { type: String },
    lastName: String,
    family: {
        name: { type: String }
    }
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
            console.log(operators);
            expect(createMb()).to.be.an.instanceOf(MatchHelper);
        });
    });

    describe('MatchHelper.getKeyAndValues', function () {

        it('extracts the key and value from the specified string and returns an array with the string and value', function () {
            const mb = createMb();
            const expected = ['name', 'Jonas'];
            expect(mb.getKeyAndValues('name:Jonas', ':')).to.eql(expected);
        });

        it('extracts the key and values from the specified string given a string with a substring of comma seperated values.', function () {
            const mb = createMb();
            const expected = ['names', ['Jonas', 'Tomanga']];
            const string = 'names=Jonas, Tomanga';
            expect(mb.getKeyAndValues(string, '=')).to.eql(expected);
        });
    });
});
