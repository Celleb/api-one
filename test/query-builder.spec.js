/**
 * query-builder.spec.ts
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
var QueryBuilder = require('../dist/lib').QueryBuilder;
var dictionary = {
    number: 'number',
    firstName: 'name',
    lastName: 'surname',
    family: {
        _id: 'fam',
        name: 'name'
    }
};
var schemaDef = {
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
            var qb = QueryBuilder.create(schemaDef, dictionary);
            expect(qb).to.instanceOf(QueryBuilder);
        });
    });
    describe('.limit', function () {
        it('creates an aggregation pipeline limit stage object from the given value', function () {
            var qb = createQb();
            var expected = { $limit: 10 };
            expect(qb.limit(10)).to.eql(expected);
        });
        it('creates an aggregation pipeline limit stage object using the default value when given an invalid or missing value', function () {
            var qb = createQb();
            var expected = { $limit: 1000 };
            expect(qb.limit(undefined)).to.eql(expected);
            expect(qb.limit('five')).to.eql(expected);
            expect(qb.limit({})).to.eql(expected);
        });
    });
});
