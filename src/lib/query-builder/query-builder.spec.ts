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

function createQbN() {
    return QueryBuilder.create(schemaDef);
}

describe('QueryBuilder', function () {
    describe('QueryBuilder#create', function () {
        it('creates a new instance of QueryBuilder, ', function () {
            const qb = QueryBuilder.create(schemaDef, dictionary);
            expect(qb).to.instanceOf(QueryBuilder);
        });
    });

    describe('QueryBuilder.limit', function () {
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

    describe('QueryBuilder.skip', function () {
        it('creates an aggregation pipeline skip stage object from the given value', function () {
            const qb = createQb();
            const expected = { $skip: 10 };
            expect(qb.skip(10)).to.eql(expected);
        });
        it('creates an aggregation pipeline skip stage object using the default value when given an invalid or missing value', function () {
            const qb = createQb();
            const expected = { $skip: 0 };
            expect(qb.skip(undefined)).to.eql(expected);
            expect(qb.skip('five')).to.eql(expected);
            expect(qb.skip({})).to.eql(expected);
        });
    });

    describe('QueryBuilder.sort', function () {

        it('creates a sort stage for the aggregation pipeline from the given string. (key will be translated)', function () {
            const qb = createQb();
            let sort = 'id:asc';
            let expected: any = { $sort: { _id: 1 } };
            expect(qb.sort(sort)).to.eql(expected);
            sort = 'name:desc';
            expected = { $sort: { firstName: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline, with multiple sort keys', function () {
            const qb = createQb();
            const sort = 'id:asc;name:desc';
            const expected: any = { $sort: { _id: 1, firstName: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline with $natural sort key when sort=`natural`', function () {
            const qb = createQb();
            let sort = '$natural:desc';
            let expected: any = { $sort: { $natural: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
            sort = '$natural:asc';
            expected = { $sort: { $natural: 1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline with $meta sort key when sort=`meta`', function () {
            const qb = createQb();
            let sort = '$meta';
            let expected: any = { $sort: { $meta: 'textScore' } };
            expect(qb.sort(sort)).to.eql(expected);
            sort = '$meta;name:asc';
            expected = { $sort: { $meta: 'textScore', firstName: 1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('returns null when given invalid search options', function () {
            const qb = createQb();
            expect(qb.sort('five')).to.eql(null);
            expect(qb.sort('firstName:asc')).to.eql(null);
            expect(qb.sort('name:2')).to.eql(null);
            expect(qb.sort(':asc')).to.eql(null);
        });
    });

    describe('QueryBuilder.include', function () {
        it('creates a projection stage for the aggregation pipeline from the given string.', function () {
            const qb = createQb();
            let expected = { $project: { firstName: true } };
            expect(qb.include('name')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline with multiple items from the given string.', function () {
            const qb = createQb();
            let expected = { $project: { firstName: true, _id: true } };
            expect(qb.include('name, id')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline from the given string. (no key translation)', function () {
            const qb = createQb();
            let expected: any = { $project: { 'first.name': true } };
            expect(qb.include('first.name')).to.eql(expected);
            expected.$project['last.name'] = true;
            expect(qb.include('first.name, last.name')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline from the given value. (Using QueryBuilder with no dictionary)', function () {
            const qb = createQbN();
            let expected: any = { $project: { 'name': true } };
            expect(qb.include('name')).to.eql(expected);
            expected.$project['surname'] = true;
            expect(qb.include('name, surname')).to.eql(expected);
        });
    });
});
