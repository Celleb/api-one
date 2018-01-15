/**
 * model.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiPromised from 'chai-as-promised';
chai.use(chaiPromised);
const expect = chai.expect;

const Model = require('../dist/core/model').Model;
const DI = require('../dist/core/di').DI;

const Models = {
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
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            const results = model.reverse(data);
            expect(results).to.eql(expectedData);
        });
        it('reverses api keys to database keys using provided dictionary', function () {
            const dictionary = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'members'
                }
            };
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    members: 5
                }
            };
            const expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            const results = model.reverse(data, dictionary);
            expect(results).to.eql(expectedData);
        });
    });
    describe('.translate', function () {
        it('transles database keys to api keys using instance dictionary', function () {
            const data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('cars');
            const results = model.translate(data);
            expect(results).to.eql(expectedData);
        });
        it('transles database keys to api keys using provided dictionary', function () {
            const dictionary = {
                firstName: 'name',
                lastName: 'surname',
                familyTree: {
                    _id: 'family',
                    members: 'members'
                }
            };
            const data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            const results = model.translate(data, dictionary);
            expect(results).to.eql(expectedData);
        });
    });

    describe('.insert', function () {
        it('inserts a new document into the database', function () {
            const data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            return expect(model.insert(data)).to.eventually.eql(data);
        });
        it('reverse data keys and inserts a new document into the database', function () {
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            return expect(model.insert(data, { reverse: true })).to.eventually.eql(expectedData);
        });

        it('reverse data keys and inserts a new document into the database and translates the returned data keys', function () {
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('cars');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });

        it('inserts a new document into the database and translates the returned data keys', function () {
            const expectedData = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('cars');
            return expect(model.insert(data, { translate: true })).to.eventually.eql(expectedData);
        });

        it('reverse data keys and inserts a collection of documents into the database and translates the returned data keys', function () {
            const data = [{
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
            const model = Model.create('cars');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });
    });

    after(function () {
    });
});
