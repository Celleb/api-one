/**
 * mapper.util.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;

const Mapper = require('../dist/lib/utils').Mapper;

const dataBase = {
    firstName: 'Jonas',
    lastName: 'Tomanga'
};
const dictionary = {
    firstName: 'name',
    lastName: 'surname',
    best: {
        _id: 'bestes',
        car: 'cars'
    }
};

describe('Mapper', function () {
    describe('#mapper', function () {
        it('changes data keys to the dictionary values with corresponding keys.', function () {

            const data = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                food: 'food',
                best: 'cars'
            };
            const expectedData = {
                name: 'Jonas',
                surname: 'Tomanga',
                food: 'food',
                best: 'cars'
            };
            expect(Mapper.mapper(data, dictionary)).to.eql(expectedData);
        });

        it('changes data keys the values dictionary values with corresponding keys, given nested data', function () {
            const data = {
                fullName: 'Jonas Tomanga',
                familyTree: {
                    number: 1
                }
            };
            const dict = {
                fullName: 'name',
                familyTree: {
                    _id: 'family',
                    number: 'number'
                }
            };
            const expectedData = {
                name: 'Jonas Tomanga',
                family: {
                    number: 1
                }
            };
            const mappedData = Mapper.mapper(data, dict);
            expect(mappedData).to.eql(expectedData);
        });
    });

    describe('#map', function () {
        it('changes data keys to the dictionary values with corresponding keys given an object', function () {
            const expectedData = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            expect(Mapper.map(dataBase, dictionary)).to.eql(expectedData);
        });
        it('changes data keys to the dictionary values with corresponding keys given a collection objects', function () {
            const data = [
                {
                    firstName: 'Jonas',
                    lastName: 'Tomanga'
                },
                {
                    firstName: 'Jon',
                    lastName: 'Manga'
                }
            ];
            const expectedData = [{
                name: 'Jonas',
                surname: 'Tomanga',
            },
            {
                name: 'Jon',
                surname: 'Manga'
            }
            ];
            expect(Mapper.map(data, dictionary)).to.eql(expectedData);
        });
    });

    describe('#invert', function () {
        it('inverts dictionary keys', function () {
            const dict = {
                firstName: 'name',
                lastName: 'surname'
            };
            const expected = {
                name: 'firstName',
                surname: 'lastName'
            };
            const results = Mapper.invert(dict);
            expect(results).to.eql(expected);
        });

        it('inverts nested dictionary keys', function () {
            const dict = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'memb'
                }
            };
            const expected = {
                name: 'firstName',
                surname: 'lastName',
                family: {
                    _id: 'familyTree',
                    memb: 'members'
                }
            };
            const results = Mapper.invert(dict);
            expect(results).to.eql(expected);
        });
    });

    describe('#getKeyValue', function () {
        it('extracts the value of the specified key from the dictionary and returns it', function () {
            expect(Mapper.getKeyValue('firstName', dictionary)).to.eql('name');
            expect(Mapper.getKeyValue('best', dictionary)).to.eql('bestes');
        });

        it('returns null key when no dictionary is provided', function () {
            expect(Mapper.getKeyValue('firstName')).to.eql(null);
        });

        it('returns null when the key does not exist in dictionary', function () {
            expect(Mapper.getKeyValue('name', dictionary)).to.eql(null);
        });
    });
});
