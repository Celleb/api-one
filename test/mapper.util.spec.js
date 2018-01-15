"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var expect = chai.expect;
var Mapper = require('../dist/lib/utils').Mapper;
var dataBase = {
    firstName: 'Jonas',
    lastName: 'Tomanga'
};
var dictionary = {
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
            var data = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                food: 'food',
                best: 'cars'
            };
            var expectedData = {
                name: 'Jonas',
                surname: 'Tomanga',
                food: 'food',
                best: 'cars'
            };
            expect(Mapper.mapper(data, dictionary)).to.eql(expectedData);
        });
        it('changes data keys the values dictionary values with corresponding keys, given nested data', function () {
            var data = {
                fullName: 'Jonas Tomanga',
                familyTree: {
                    number: 1
                }
            };
            var dict = {
                fullName: 'name',
                familyTree: {
                    _id: 'family',
                    number: 'number'
                }
            };
            var expectedData = {
                name: 'Jonas Tomanga',
                family: {
                    number: 1
                }
            };
            var mappedData = Mapper.mapper(data, dict);
            expect(mappedData).to.eql(expectedData);
        });
    });
    describe('#map', function () {
        it('changes data keys to the dictionary values with corresponding keys given an object', function () {
            var expectedData = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            expect(Mapper.map(dataBase, dictionary)).to.eql(expectedData);
        });
        it('changes data keys to the dictionary values with corresponding keys given a collection objects', function () {
            var data = [
                {
                    firstName: 'Jonas',
                    lastName: 'Tomanga'
                },
                {
                    firstName: 'Jon',
                    lastName: 'Manga'
                }
            ];
            var expectedData = [{
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
    describe('#inverter', function () {
        it('inverts dictionary keys', function () {
            var dict = {
                firstName: 'name',
                lastName: 'surname'
            };
            var expected = {
                name: 'firstName',
                surname: 'lastName'
            };
            var results = Mapper.inverter(dict);
            expect(results).to.eql(expected);
        });
        it('inverts nested dictionary keys', function () {
            var dict = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'memb'
                }
            };
            var expected = {
                name: 'firstName',
                surname: 'lastName',
                family: {
                    _id: 'familyTree',
                    memb: 'members'
                }
            };
            var results = Mapper.inverter(dict);
            expect(results).to.eql(expected);
        });
    });
});
