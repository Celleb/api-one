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
    _id: { type: Number },
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

    describe('.skip', function () {
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

    describe('.sort', function () {

        it('creates a sort stage for the aggregation pipeline from the given string. (translated)', function () {
            const qb = createQb();
            let sort = 'id:asc';
            let expected: any = { $sort: { _id: 1 } };
            expect(qb.sort(sort)).to.eql(expected);
            sort = 'name:desc';
            expected = { $sort: { firstName: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline, with multiple sort keys (translated)', function () {
            const qb = createQb();
            const sort = 'id:asc;name:desc';
            const expected: any = { $sort: { _id: 1, firstName: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline, with multiple sort keys (keys not in dictionary)', function () {
            const qb = createQb();
            const sort = 'first:asc;last:desc';
            const expected: any = { $sort: { first: 1, last: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline, with multiple sort keys (no dictionary)', function () {
            const qb = createQbN();
            const sort = 'first:asc;last:desc';
            const expected: any = { $sort: { first: 1, last: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline with $natural sort key when sort=`natural` (translated)', function () {
            const qb = createQb();
            let sort = '$natural:desc';
            let expected: any = { $sort: { $natural: -1 } };
            expect(qb.sort(sort)).to.eql(expected);
            sort = '$natural:asc';
            expected = { $sort: { $natural: 1 } };
            expect(qb.sort(sort)).to.eql(expected);
        });

        it('creates a sort stage for the aggregation pipeline with $meta sort key when sort=`meta` (translated)', function () {
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
            expect(qb.sort('name:2')).to.eql(null);
            expect(qb.sort(':asc')).to.eql(null);
        });
    });

    describe('.include', function () {
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

    describe('.exclude', function () {
        it('creates a projection stage for the aggregation pipeline from the given string.', function () {
            const qb = createQb();
            let expected = { $project: { firstName: false } };
            expect(qb.exclude('name')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline with multiple items from the given string.', function () {
            const qb = createQb();
            let expected = { $project: { firstName: false, _id: false } };
            expect(qb.exclude('name, id')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline from the given string. (no key translation)', function () {
            const qb = createQb();
            let expected: any = { $project: { 'first.name': false } };
            expect(qb.exclude('first.name')).to.eql(expected);
            expected.$project['last.name'] = false;
            expect(qb.exclude('first.name, last.name')).to.eql(expected);
        });
        it('creates a projection stage for the aggregation pipeline from the given value. (Using QueryBuilder with no dictionary)', function () {
            const qb = createQbN();
            let expected: any = { $project: { 'name': false } };
            expect(qb.exclude('name')).to.eql(expected);
            expected.$project['surname'] = false;
            expect(qb.exclude('name, surname')).to.eql(expected);
        });
    });

    describe('.search', function () {
        it('creates a search stage for the aggregation pipeline from the given string.', function () {
            const qb = createQb();
            let expected = { $match: { $text: { $search: 'Text search' } } };
            expect(qb.search('Text search')).to.eql(expected);
        });
    });

    describe('.match', function () {
        it('creates a match stage for the aggregation pipeline from the given string. (no dictionary)', function () {
            const qb = createQbN();
            let expected: any = { $match: { _id: 100, number: { $gte: 5 } } };
            let query = '_id:100;number>:5';
            expect(qb.match(query)).to.eql(expected);

            expected = { $match: { _id: { $in: [100, 20] }, number: { $lt: 5, $gt: 0 } } };
            query = '_id:100,20;number<>5,0';
            expect(qb.match(query)).to.eql(expected);
        });

        it('throws an exception on invalid match input', function () {
            const qb = createQbN();
            expect(() => qb.match()).to.throw();
            expect(() => qb.match(null)).to.throw();
            expect(() => qb.match(true)).to.throw();
            expect(() => qb.match(1)).to.throw();
        });

        it('returns null when given invalid string input', function () {
            const qb = createQbN();
            expect(qb.match('1')).to.eql(null);
        });
    });

    describe('.build', function () {
        it('builds an aggregation pipeline from the query string', function () {
            let query = {
                match: '_id:4',
                limit: '10',
                skip: '5',
                include: 'firstName'
            };
            const expected = [
                { $match: { _id: 4 } },
                { $limit: 10 },
                { $skip: 5 },
                { $project: { firstName: true } }
            ];
            const qb = createQbN();
            expect(qb.build(query)).to.eql(expected);
        });

        it('builds an aggregation pipeline from the query string (dictionary)', function () {
            let query = {
                match: 'id:4',
                limit: '10',
                skip: '5',
                include: 'name'
            };
            const expected = [
                { $match: { _id: 4 } },
                { $limit: 10 },
                { $skip: 5 },
                { $project: { firstName: true } }
            ];
            const qb = createQb();
            expect(qb.build(query)).to.eql(expected);
        });

        it('builds an aggregation pipeline from the query string omitting unsupported stages', function () {
            let query = {
                matches: '_id:4',
                limit: '10',
                skip: '5',
                include: 'firstName'
            };

            const expected = [
                { $limit: 10 },
                { $skip: 5 },
                { $project: { firstName: true } }
            ];

            const qb = createQbN();
            expect(qb.build(query)).to.eql(expected);
        });

        it('it puts the search stage first in the aggregation pipeline', function () {
            let query = {
                match: '_id:4',
                search: 'Jonas Tomanga',
                include: 'firstName'
            };

            const expected = [
                { $match: { $text: { $search: 'Jonas Tomanga' } } },
                { $match: { _id: 4 } },
                { $project: { firstName: true } }
            ];

            const qb = createQbN();
            expect(qb.build(query)).to.eql(expected);
        });

        it('throws a TypeError exception when a query property is not a string', function () {
            const qb = createQbN();
            let query = {
                match: {
                    id: 4
                }
            };

            expect(() => qb.build(query)).to.throw(TypeError, 'A string is expected for query property used in query builder.');
        });
    });
});
