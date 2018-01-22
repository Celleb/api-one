/**
 * model.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var sinon = require("sinon");
var chaiPromised = require("chai-as-promised");
chai.use(chaiPromised);
var expect = chai.expect;
var Model = require('../dist/core/model').Model;
var DI = require('../dist/core/di').DI;
var dictionary = {
    firstName: 'name',
    lastName: 'surname',
    familyTree: {
        _id: 'family',
        members: 'memb'
    }
};
var mainData = {
    firstName: 'Jon',
    lastName: 'Manga',
    familyTree: {
        members: 5
    }
};
var transData = {
    name: 'Jon',
    surname: 'Manga',
    family: {
        memb: 5
    }
};
var findOneAndUpdate = function (query, update) {
    var data = __assign({}, mainData);
    for (var key in update) {
        if (data.hasOwnProperty(key)) {
            data[key] = update[key];
        }
    }
    return Promise.resolve(data);
};
var findOne = function (query, options) {
    return Promise.resolve(mainData);
};
var findOneAndRemove = function (query) {
    return Promise.resolve(mainData);
};
var create = function (docs) {
    return Promise.resolve(docs);
};
var Models = {
    model: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return {
            create: create,
            findOne: findOne,
            findOneAndUpdate: findOneAndUpdate,
            findOneAndRemove: findOneAndRemove
        };
    },
    modelDef: function (model) {
        return {
            options: {
                dictionary: dictionary
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
            var model = Model.create('users');
            expect(model).to.be.an.instanceOf(Model);
            expect(Models.model.calledWith('users')).to.be.ok;
            expect(Models.modelDef.calledWith('users')).to.be.ok;
            expect(model.dictionary).eql(dictionary);
            after(function () {
                Models.model.restore();
                Models.modelDef.restore();
            });
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
            var model = Model.create('users');
            var results = model.reverse(data);
            expect(results).to.eql(expectedData);
        });
        it('reverses api keys to database keys using provided dictionary', function () {
            var dict = {
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
            var model = Model.create('users');
            var results = model.reverse(data, dict);
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
            var model = Model.create('users');
            var results = model.translate(data);
            expect(results).to.eql(expectedData);
        });
        it('transles database keys to api keys using provided dictionary', function () {
            var dict = {
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
            var model = Model.create('users');
            var results = model.translate(data, dict);
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
            var model = Model.create('users');
            return expect(model.insert(data)).to.eventually.eql(data);
        });
        it('inserts a new document into the database without reversing and translating given an empty dictionary', function () {
            var data = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('users');
            model.dictionary = {};
            return expect(model.insert(data, { translate: true, reverse: true })).to.eventually.eql(data);
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
            var model = Model.create('users');
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
            var model = Model.create('users');
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
            var model = Model.create('users');
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
            var model = Model.create('users');
            return expect(model.insert(data, { reverse: true, translate: true })).to.eventually.eql(data);
        });
    });
    describe('.create', function () {
        it('inserts a new document into the database', function () {
            var expectedData = {
                firstName: 'Jon',
                lastName: 'Manga',
                familyTree: {
                    members: 5
                }
            };
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('users');
            return expect(model.create({ body: data })).to.eventually.eql(expectedData);
        });
        it('translates the data keys and inserts a new document into the database', function () {
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('users');
            return expect(model.create({ body: data }, true)).to.eventually.eql(data);
        });
        it('extracts data from session and inserts a new document into the database', function () {
            var data = {
                name: 'Jon',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var expectedData = __assign({}, data, { uid: 4 });
            var model = Model.create('users');
            model.createAuthMap = {
                uid: 'uid'
            };
            return expect(model.create({ body: data, session: { uid: 4 } }, true)).to.eventually.eql(expectedData);
        });
    });
    describe('.modify', function () {
        it('passes on the query, data and query-update-options to db method', function () {
            var data = {};
            var model = Model.create('users');
            var options = {
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
            var data = {
                firstName: 'Jonas',
                lastName: 'Tomanga'
            };
            var expectedData = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('users');
            return expect(model.modify({}, data)).to.eventually.eql(expectedData);
        });
        it('reverse keys and modifies data', function () {
            var data = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            var expectedData = {
                firstName: 'Jonas',
                lastName: 'Tomanga',
                familyTree: {
                    members: 5
                }
            };
            var model = Model.create('users');
            var options = {
                data: {
                    reverse: true
                }
            };
            return expect(model.modify({}, data, options)).to.eventually.eql(expectedData);
        });
        it('reverse keys and modifies data and translates the keys', function () {
            var data = {
                name: 'Jonas',
                surname: 'Tomanga'
            };
            var expectedData = {
                name: 'Jonas',
                surname: 'Tomanga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('users');
            var options = {
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
            var req = {
                body: { name: 'Jonas' }
            };
            var options = {
                data: { translate: true, reverse: true },
                query: { new: true }
            };
            var match = {
                id: 1
            };
            var expectedData = {
                name: 'Jonas',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('users');
            sinon.spy(model, 'modify');
            after(function () {
                model.modify.restore();
            });
            var results = model.patch(match, req, options);
            expect(model.modify.calledWith(match, req.body, options)).to.be.ok;
            return expect(results).to.eventually.eql(expectedData);
        });
        it('patches a matching document by the owner', function () {
            var req = {
                body: { name: 'Jonas' },
                $owner: true,
                session: { uid: 5 }
            };
            var options = {
                data: { translate: true },
                query: { new: true }
            };
            var match = {
                id: 1
            };
            var model = Model.create('users');
            model.ownerKey = '_id';
            sinon.spy(model, 'modify');
            model.patch(match, req, options);
            expect(model.modify.calledWith(__assign({}, match, { _id: 5 }), req.body, options)).to.be.ok;
            after(function () {
                model.modify.restore();
            });
        });
        it('patches a matching document and returns the current document if given req with query.current set to true', function () {
            var req = {
                body: { name: 'Jonas' },
                query: { current: 'true' },
                $owner: true,
                session: { uid: 5 }
            };
            var options = {
                data: { translate: true }
            };
            var match = {
                id: 1
            };
            var model = Model.create('users');
            model.ownerKey = '_id';
            sinon.spy(model, 'modify');
            model.patch(match, req, options);
            expect(model.modify.calledWith(__assign({}, match, { _id: 5 }), req.body, __assign({}, options, { query: { new: true } }))).to.be.ok;
            after(function () {
                model.modify.restore();
            });
        });
        it('throws an error when trying to patch a document by owner with missing ownerKey', function () {
            var req = {
                body: { name: 'Jonas' },
                $owner: true,
                session: { uid: 5 }
            };
            var options = {
                data: { translate: true },
                query: { new: true }
            };
            var match = {
                id: 1
            };
            var model = Model.create('users');
            expect(function () { model.patch(match, req, options); }).to.throw(ReferenceError, 'Owner key is undefined or null.');
        });
    });
    describe('.patchByID', function () {
        it('patches a document that matches the id.', function () {
            var req = {
                body: { name: 'Jonas' },
                params: {
                    id: 2
                }
            };
            var expectedData = {
                name: 'Jonas',
                surname: 'Manga',
                family: {
                    memb: 5
                }
            };
            var model = Model.create('users');
            sinon.spy(model, 'patch');
            after(function () {
                model.patch.restore();
            });
            var results = model.patchByID(req);
            expect(model.patch.calledWith({ _id: 2 })).to.be.ok;
            return expect(results).to.eventually.eql(expectedData);
        });
        it('thorws a ReferenceError if req.param.id is missing', function () {
            var model = Model.create('users');
            return expect(model.patchByID({})).to.eventually.be.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });
    describe('.delete', function () {
        it('removes the document(s) from the database and returns it', function () {
            var model = Model.create('users');
            return expect(model.delete({ _id: 3 })).to.eventually.eql(mainData);
        });
        it('removes the document(s) from the database returns a translated document', function () {
            var model = Model.create('users');
            return expect(model.delete({ _id: 3 }, true)).to.eventually.eql(transData);
        });
    });
    describe('.deleteByID', function () {
        it('removes the document that matches the id in req.params', function () {
            var model = Model.create('users');
            var req = {
                params: { id: 5 }
            };
            sinon.spy(model, 'delete');
            after(function () {
                model.delete.restore();
            });
            var results = model.deleteByID(req, true);
            expect(model.delete.calledWith({ _id: 5 })).to.be.ok;
            return expect(results).to.eventually.eql(undefined);
        });
        it('reject with ReferenceError when `req.params.id` is missing', function () {
            var model = Model.create('users');
            return expect(model.deleteByID({})).to.eventually.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });
    describe('.findOne', function () {
        it('returns single document from the db that matches the provided query', function () {
            var model = Model.create('users');
            return expect(model.findOne({ _id: 2 })).to.eventually.eql(mainData);
        });
        it('passes on the options to the models findOne function', function () {
            var model = Model.create('users');
            sinon.spy(model.model, 'findOne');
            model.findOne({}, { lean: true });
            expect(model.model.findOne.calledWith({}, { lean: true })).to.be.ok;
            after(function () {
                model.model.findOne.restore();
            });
        });
        it('returns a translated single document from the database that matches the provided query', function () {
            var model = Model.create('users');
            return expect(model.findOne({}, { translate: true })).to.eventually.eql(transData);
        });
    });
    describe('.findOneByID', function () {
        it('returns a single document that matches the `req.params.id`', function () {
            var req = {
                params: {
                    id: 1
                }
            };
            var model = Model.create('users');
            sinon.spy(model, 'findOne');
            var results = model.findOneByID(req);
            after(function () {
                model.findOne.restore();
            });
            expect(model.findOne.calledWith({ _id: 3 }, { translate: true, lean: true }));
            return expect(results).to.eventually.eql(transData);
        });
        it('throws a ReferenceError is `req.params.id` is undefined', function () {
            var model = Model.create('users');
            return expect(model.findOneByID({})).to.eventually.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });
});
