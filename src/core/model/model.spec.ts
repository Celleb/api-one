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
import { DI } from 'tsjs-di';

chai.use(chaiPromised);
const expect = chai.expect;


const Model = require('../').Model;
const getModel = require('../../model.mock').getModel;

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



const _model = getModel(mainData);

const modelOptions = {
    name: 'users',
    schemaDef: {},
    options: {
        dictionary
    }
};

function createModel() {
    return Model.create(_model, modelOptions)
}

describe('Model', function () {

    beforeEach(function () {

    });

    describe('#create', function () {
        it('creates a new instance of model', function () {
            const model = createModel();
            expect(model).to.be.an.instanceOf(Model);
            expect(model.dictionary).eql(dictionary);
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
            const model = createModel();
            const results = model.reverse(data);
            expect(results).to.eql(expectedData);
        });
        it('reverses api keys to database keys using provided dictionary', function () {
            const dict = {
                name: 'firstName',
                surname: 'lastName',
                family: {
                    _id: 'familyTree',
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
            model.createAuthMap = {
                uid: 'uid'
            };
            return expect(model.create({ body: data, session: { uid: 4 } }, true)).to.eventually.eql(expectedData);
        });
    });

    describe('.modify', function () {
        it('passes on the query, data and query-update-options to db method', function () {
            const data = {};
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
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
            const model = createModel();
            sinon.spy(model, 'patch');
            after(function () {
                model.patch.restore();
            });
            const results = model.patchByID(req);
            expect(model.patch.calledWith({ _id: 2 })).to.be.ok;
            return expect(results).to.eventually.eql(expectedData);
        });

        it('thorws a ReferenceError if req.param.id is missing', function () {
            const model = createModel();
            return expect(model.patchByID({})).to.eventually.be.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });

    describe('.delete', function () {
        it('removes the document(s) from the database and returns it', function () {
            const model = createModel();
            return expect(model.delete({ _id: 3 })).to.eventually.eql(mainData);
        });

        it('removes the document(s) from the database returns a translated document', function () {
            const model = createModel();
            return expect(model.delete({ _id: 3 }, true)).to.eventually.eql(transData);
        });
    });

    describe('.deleteByID', function () {
        it('removes the document that matches the id in req.params', function () {
            const model = createModel();
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
            const model = createModel();
            return expect(model.deleteByID({})).to.eventually.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });

    describe('.findOne', function () {
        it('returns single document from the db that matches the provided query', function () {
            const model = createModel();
            return expect(model.findOne({ _id: 2 })).to.eventually.eql(mainData);
        });

        it('passes on the options to the models findOne function', function () {
            const model = createModel();
            sinon.spy(model.model, 'findOne');
            model.findOne({}, { lean: true });
            expect(model.model.findOne.calledWith({}, { lean: true })).to.be.ok;
            after(function () {
                model.model.findOne.restore();
            });
        });

        it('returns a translated single document from the database that matches the provided query', function () {
            const model = createModel();
            return expect(model.findOne({}, { translate: true })).to.eventually.eql(transData);
        });
    });

    describe('.findOneByID', function () {
        it('returns a single document that matches the `req.params.id`', function () {
            const req = {
                params: {
                    id: 1
                }
            };
            const model = createModel();
            sinon.spy(model, 'findOne');
            const results = model.findOneByID(req);
            after(function () {
                model.findOne.restore();
            });
            expect(model.findOne.calledWith({ _id: 3 }, { translate: true, lean: true }));
            return expect(results).to.eventually.eql(transData);
        });

        it('throws a ReferenceError is `req.params.id` is undefined', function () {
            const model = createModel();
            return expect(model.findOneByID({})).to.eventually.rejectedWith(ReferenceError, 'Missing parameter: `id`.');
        });
    });

    describe('.rollback', function () {
        it('rolls back inserted content', function () {
            const model = createModel();
            sinon.spy(model, 'delete');
            return expect(model.rollback({ _id: 1 })).to.eventually.eql(null);
        });

        it('rolls back updated content', function () {
            const model = createModel();
            const data = { firstName: 'James' };
            const expectedData = { ...mainData, ...data };
            return expect(model.rollback(2, data)).to.eventually.eql(expectedData);
        });

        it('rolls back updated content with options', function () {
            const model = createModel();
            sinon.spy(model, 'modify');
            const options = {
                query: { upsert: false }
            };
            model.rollback(2, {}, false, {
                query: { upsert: false }
            });
            expect(model.modify.calledWith({ _id: 2 }, {}, options)).to.be.ok;
        });

        it('it rolls back deleted content', function () {
            const model = createModel();
            const data = {
                firstName: 'James',
                lastName: 'Bond',
                familyTree: {
                    members: 7
                }
            };
            const options = {
                query: { upsert: true }
            };
            sinon.spy(model, 'modify');
            after(function () {
                model.modify.restore();
            });
            const results = model.rollback(2, data, true);
            expect(model.modify.calledWith({ _id: 2 }, data, options)).to.be.ok;
            return expect(results).to.eventually.eql(data);
        });
    });


    describe('.find', function () {
        it('should be a function', function () {
            const model = createModel();
            expect(model.find).to.be.a('function');
        });

        it('returns all the matching data', function () {
            const model = createModel();
            expect(model.find({}, {})).to.eventually.eql([mainData]);
        });

        it('appends the pipeline', function () {
            const model = createModel();
            const options = {
                preMatch: {}
            };

            const req = {
                query: {
                    match: 'id:2'
                }
            };

            sinon.spy(model.model, 'aggregate');

            after(function () {
                model.model.aggregate.restore();
            });

            const expectedPipeline = [{ $match: {} }, { $match: { id: '2' } }];
            model.find(req, options);
            expect(model.model.aggregate.calledWith(expectedPipeline)).to.be.ok;
        });

        it('translates the data', function () {
            const model = createModel();
            const options = {
                preMatch: { $match: {} }
            };
            const req = {};

            return expect(model.find(req, { translate: true })).to.eventually.eql([transData]);
        });
    });

    describe('.findAll', function () {
        it('should be a function', function () {
            const model = createModel();
            expect(model.findAll).to.be.a('function');
        });

        it('returns all matchings doc amd translates the data', function () {
            const model = createModel();
            const options = {
                preMatch: {}
            };
            const req = {};

            return expect(model.findAll(req)).to.eventually.eql([transData]);
        });

        it('prematch owner documents', function () {
            let model = createModel();
            model.ownerKey = '_id';

            const options = {
                preMatch: { $match: {} }
            };

            const req = {
                query: {
                    match: 'id:2'
                },
                session: {
                    uid: 1
                },
                $owner: true
            };

            //    sinon.spy(model.model, 'aggregate');

            after(function () {
                // model.model.aggregate.restore();
            });

            const expectedPipeline = [{ $match: { _id: 1 } }, { $match: { id: '2' } }];
            model.findAll(req, options);
            expect(model.model.aggregate.calledWith(expectedPipeline)).to.be.ok;
        });
    });
});
