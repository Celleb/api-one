/**
 * query-builder.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;

const QueryBuilder = require('../dist/lib').QueryBuilder;

const dictionary = {
    number: 'number',
    firstName: 'name',
    lastName: 'surname',
    family: {
        _id: 'fam',
        name: 'name'
    }
};

const schemaDef = {
    number: Number,
    firstName: { type: String },
    lastName: String,
    family: {
        name: { type: String }
    }
};

function createQb() {
    return QueryBuilder.create(schemaDef, dictionary);
}

describe('QueryBuilder', function () {
    describe('#create', function () {
        it('creates a new instance of QueryBuilder, ', function () {
            const qb = QueryBuilder.create(schemaDef, dictionary);
            expect(qb).to.instanceOf(QueryBuilder);
        });
    });

    describe('.limit', function () {
        it('creates an aggregation pipeline limit stage object from the given value', function () {
            const qb = createQb();
            const expected = { $limit: 10 };
            expect(qb.limit(10)).to.eql(expected);
        });

        it('creates an aggregation pipeline limit stage object using the default value when given an invalid or missing value', function () {
            const qb = createQb();
            const expected = { $limit: 1000 };
            expect(qb.limit(undefined)).to.eql(expected);
            expect(qb.limit('five')).to.eql(expected);
            expect(qb.limit({})).to.eql(expected);
        });
    });
});
