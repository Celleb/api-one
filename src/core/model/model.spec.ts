/**
 * model.spec.ts
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
import * as chaiPromised from 'chai-as-promised';
chai.use(chaiPromised);
const expect = chai.expect;

const Model = require('../dist/core/model').Model;
const DI = require('../dist/core/di').DI;
const dictionary = {
    firstName: 'name',
    lastName: 'surname',
    familyTree: {
        _id: 'family',
        members: 'memb'
    }
};
const mainData = {
    firstName: 'Jon',
    lastName: 'Manga',
    familyTree: {
        members: 5
    }
};
const transData = {
    name: 'Jon',
    surname: 'Manga',
    family: {
        memb: 5
    }
};
const findOneAndUpdate = function (query, update) {
    const data = { ...mainData };
    for (let key in update) {
        if (data.hasOwnProperty(key)) {
            data[key] = update[key];
        }
    }
    return Promise.resolve(data);
};
const findOne = function (query, options) {
    return Promise.resolve(mainData);
};
const findOneAndRemove = function (query) {
    return Promise.resolve(mainData);
};
const create = function (docs) {
    return Promise.resolve(docs);
};
const Models = {
    model: function (...args) {
        return {
            create,
            findOne,
            findOneAndUpdate,
            findOneAndRemove
        };
    },
    modelDef: function (model) {
        return {
            options: {
                dictionary
            }
        };
    }
};

describe('Model', function () {
    beforeEach(function () {
        DI.clear();
        DI.register({
            provide: 'Models', useValue: Models
        });

    });
    describe('#create', function () {
        it('creates a new instance of model', function () {
            sinon.spy(Models, 'model');
            sinon.spy(Models, 'modelDef');
            const model = Model.create('users');
            expect(model).to.be.an.instanceOf(Model);
            expect((<any>Models).model.calledWith('users')).to.be.ok;
            expect((<any>Models).modelDef.calledWith('users')).to.be.ok;
            expect(model.dictionary).eql(dictionary);
            after(function () {
                (<any>Models).model.restore();
                (<any>Models).modelDef.restore();
            });
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
            const model = Model.create('users');
            const results = model.reverse(data);
            expect(results).to.eql(expectedData);
        });
        it('reverses api keys to database keys using provided dictionary', function () {
            const dict = {
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
            const model = Model.create('users');
            const results = model.reverse(data, dict);
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
            const model = Model.create('users');
            const results = model.translate(data);
            expect(results).to.eql(expectedData);
        });
        it('transles database keys to api keys using provided dictionary', function () {
            const dict = {
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
            const model = Model.create('users');
            const results = model.translate(data, dict);
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
            const model = Model.create('users');
            return expect(model.insert(data)).to.eventually.eql(data);
        });
        it('inserts a new document into the database without reversing and translating given an empty dictionary', function () {
            const data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('users');
            model.dictionary = {};
            return expect(model.insert(data, { translate: true, reverse: true })).to.eventually.eql(data);
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
            const model = Model.create('users');
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
            const model = Model.create('users');
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
            const model = Model.create('users');
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
            const model = Model.create('users');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });
    });

    describe('.create', function () {
        it('inserts a new document into the database', function () {
            const expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('users');
            return expect(model.create({ body: data })).to.eventually.eql(expectedData);
        });

        it('translates the data keys and inserts a new document into the database', function () {
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('users');
            return expect(model.create({ body: data }, true)).to.eventually.eql(data);
        });

        it('extracts data from session and inserts a new document into the database', function () {
            const data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const expectedData = { ...data, uid: 4 };
            const model = Model.create('users');
            model.createAuthMap = {
                uid: 'uid'
            };
            return expect(model.create({ body: data, session: { uid: 4 } }, true)).to.eventually.eql(expectedData);
        });
    });

    describe('.modify', function () {
        it('passes on the query, data and query-update-options to db method', function () {
            const data = {};
            const model = Model.create('users');
            const options = {
                query: { new: true }
            };
            sinon.spy(model.model, 'findOneAndUpdate');
            model.modify({}, data, options);
            expect(model.model.findOneAndUpdate.calledWith({}, data, options.query)).to.be.ok;
            after(function () {
                model.model.findOneAndUpdate.restore();
            });
        });
        it('modifies data without key translation or reversal', function () {
            const data = {
                firstName: 'Jonas',
                lastName: 'Tomanga'
            };
            const expectedData = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('users');
            return expect(model.modify({}, data)).to.eventually.eql(expectedData);
        });

        it('reverse keys and modifies data', function () {
            const data = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            const expectedData = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                familyTree: {
                    members: 5
                }
            };
            const model = Model.create('users');
            const options = {
                data: {
                    reverse: true
                }
            };
            return expect(model.modify({}, data, options)).to.eventually.eql(expectedData);
        });

        it('reverse keys and modifies data and translates the keys', function () {
            const data = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            const expectedData = {
                name: 'Jonas',
                surname: 'Tomanga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('users');
            const options = {
                data: {
                    reverse: true,
                    translate: true
                }
            };
            return expect(model.modify({}, data, options)).to.eventually.eql(expectedData);
        });
    });

    describe('.patch', function () {
        it('patches a matching document', function () {
            const req = {
                body: { name: 'Jonas' }
            };
            const options = {
                data: { translate: true, reverse: true },
                query: { new: true }
            };
            const match = {
                id: 1
            };
            const expectedData = {
                name: 'Jonas',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('users');
            sinon.spy(model, 'modify');
            after(function () {
                model.modify.restore();
            });
            const results = model.patch(match, req, options);
            expect(model.modify.calledWith(match, req.body, options)).to.be.ok;
            return expect(results).to.eventually.eql(expectedData);
        });

        it('patches a matching document by the owner', function () {
            const req = {
                body: { name: 'Jonas' },
                $owner: true,
                session: { uid: 5 }
            };
            const options = {
                data: { translate: true },
                query: { new: true }
            };
            const match = {
                id: 1
            };
            const model = Model.create('users');
            model.ownerKey = '_id';
            sinon.spy(model, 'modify');
            model.patch(match, req, options);
            expect(model.modify.calledWith({ ...match, _id: 5 }, req.body, options)).to.be.ok;
            after(function () {
                model.modify.restore();
            });
        });

        it('patches a matching document and returns the current document if given req with query.current set to true', function () {
            const req = {
                body: { name: 'Jonas' },
                query: { current: 'true' },
                $owner: true,
                session: { uid: 5 }
            };
            const options = {
                data: { translate: true }
            };
            const match = {
                id: 1
            };
            const model = Model.create('users');
            model.ownerKey = '_id';
            sinon.spy(model, 'modify');
            model.patch(match, req, options);
            expect(model.modify.calledWith({ ...match, _id: 5 }, req.body, { ...options, query: { new: true } })).to.be.ok;
            after(function () {
                model.modify.restore();
            });
        });

        it('throws an error when trying to patch a document by owner with missing ownerKey', function () {
            const req = {
                body: { name: 'Jonas' },
                $owner: true,
                session: { uid: 5 }
            };
            const options = {
                data: { translate: true },
                query: { new: true }
            };
            const match = {
                id: 1
            };
            const model = Model.create('users');
            expect(() => { model.patch(match, req, options); }).to.throw(ReferenceError, 'Owner key is undefined or null.');
        });
    });

    describe('.patchByID', function () {
        it('patches a document that matches the id.', function () {
            const req = {
                body: { name: 'Jonas' },
                params: {
                    id: 2
                }
            };
            const expectedData = {
                name: 'Jonas',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            const model = Model.create('users');
            sinon.spy(model, 'patch');
            after(function () {
                model.patch.restore();
            });
            const results = model.patchByID(req);
            expect(model.patch.calledWith({ _id: 2 })).to.be.ok;
            return expect(results).to.eventually.eql(expectedData);
        });

        it('thorws a ReferenceError if req.param.id is missing', function () {
            const model = Model.create('users');
            return expect(model.patchByID({})).to.eventually.be.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });

    describe('.delete', function () {
        it('removes the document(s) from the database and returns it', function () {
            const model = Model.create('users');
            return expect(model.delete({ _id: 3 })).to.eventually.eql(mainData);
        });

        it('removes the document(s) from the database returns a translated document', function () {
            const model = Model.create('users');
            return expect(model.delete({ _id: 3 }, true)).to.eventually.eql(transData);
        });
    });

    describe('.deleteByID', function () {
        it('removes the document that matches the id in req.params', function () {
            const model = Model.create('users');
            const req = {
                params: { id: 5 }
            };
            sinon.spy(model, 'delete');
            after(function () {
                model.delete.restore();
            });
            const results = model.deleteByID(req, true);
            expect(model.delete.calledWith({ _id: 5 })).to.be.ok;
            return expect(results).to.eventually.eql(undefined);
        });

        it('reject with ReferenceError when `req.params.id` is missing', function () {
            const model = Model.create('users');
            return expect(model.deleteByID({})).to.eventually.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });

    describe('.findOne', function () {
        it('returns single document from the db that matches the provided query', function () {
            const model = Model.create('users');
            return expect(model.findOne({ _id: 2 })).to.eventually.eql(mainData);
        });

        it('passes on the options to the models findOne function', function () {
            const model = Model.create('users');
            sinon.spy(model.model, 'findOne');
            model.findOne({}, { lean: true });
            expect(model.model.findOne.calledWith({}, { lean: true })).to.be.ok;
        });

        it('returns a single document from the database that matches the provided query', function () {
            const model = Model.create('users');
            return expect(model.findOne({}, { translate: true })).to.eventually.eql(transData);
        });
    });
});
