/**
 * model.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var sinon = require("sinon");
var chaiPromised = require("chai-as-promised");
chai.use(chaiPromised);
var expect = chai.expect;
var Model = require('../dist/core/model').Model;
var DI = require('../dist/core/di').DI;
var Models = {
    model: sinon.spy(function () {
        return {
            create: sinon.spy(function (docs) {
                return Promise.resolve(docs);
            })
        };
    }),
    modelDef: sinon.spy(function (model) {
        return {
            options: {
                dictionary: {
                    firstName: 'name',
                    lastName: 'surname',
                    familyTree: {
                        _id: 'family',
                        members: 'memb'
                    }
                }
            }
        };
    })
};
describe('Model', function () {
    beforeEach(function () {
        DI.clear();
        DI.register({
            provide: 'Models', useValue: Models
        });
        Models.model.reset();
        Models.modelDef.reset();
    });
    describe('#create', function () {
        it('creates a new instance of model', function () {
            expect(Model.create('cars')).to.be.an.instanceOf(Model);
            expect(Models.model.calledWith('cars')).to.be.ok;
            expect(Models.modelDef.calledWith('cars')).to.be.ok;
        });
    });
    describe('.reverse', function () {
        it('reverses api keys to database keys using instance dictionary', function () {
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            var results = model.reverse(data);
            expect(results).to.eql(expectedData);
        });
        it('reverses api keys to database keys using provided dictionary', function () {
            var dictionary = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'members'
                }
            };
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    members: 5
                }
            };
            var expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            var results = model.reverse(data, dictionary);
            expect(results).to.eql(expectedData);
        });
    });
    describe('.translate', function () {
        it('transles database keys to api keys using instance dictionary', function () {
            var data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('cars');
            var results = model.translate(data);
            expect(results).to.eql(expectedData);
        });
        it('transles database keys to api keys using provided dictionary', function () {
            var dictionary = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'members'
                }
            };
            var data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            var results = model.translate(data, dictionary);
            expect(results).to.eql(expectedData);
        });
    });
    describe('.insert', function () {
        it('inserts a new document into the database', function () {
            var data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            return expect(model.insert(data)).to.eventually.eql(data);
        });
        it('reverse data keys and inserts a new document into the database', function () {
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            return expect(model.insert(data, { reverse: true })).to.eventually.eql(expectedData);
        });
        it('reverse data keys and inserts a new document into the database and translates the returned data keys', function () {
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('cars');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });
        it('inserts a new document into the database and translates the returned data keys', function () {
            var expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('cars');
            return expect(model.insert(data, { translate: true })).to.eventually.eql(expectedData);
        });
        it('reverse data keys and inserts a collection of documents into the database and translates the returned data keys', function () {
            var data = [{
                    name: 'Jon',
                    surname: 'Manga',
                    family: {
                        memb: 5
                    }
                },
                {
                    name: 'Jonas',
                    surname: 'Tomanga',
                    family: {
                        memb: 5
                    }
                }
            ];
            var model = Model.create('cars');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });
    });
    after(function () {
    });
});
