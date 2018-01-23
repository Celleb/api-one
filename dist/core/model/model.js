"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const utils_1 = require("../../lib/utils");
class Model {
    constructor(model, modelDef) {
        this.dictionary = null;
        this.readExclude = null;
        this.createExclude = null;
        this.updateAuthMap = null;
        this.ownerKey = null;
        this.exclusive = null;
        this.createAuthMap = null;
        this.schemaDef = null;
        this.reverse = (data, dictionary) => {
            dictionary = dictionary ? dictionary : this.dictionary;
            dictionary = utils_1.Mapper.invert(dictionary);
            return utils_1.Mapper.map(data, dictionary);
        };
        this.translate = (data, dictionary) => {
            dictionary = dictionary ? dictionary : this.dictionary;
            return utils_1.Mapper.map(data, dictionary);
        };
        this.model = model;
        this.schemaDef = modelDef.schema;
        this.expandOptions(modelDef.options);
    }
    expandOptions(modelOptions) {
        for (let option in modelOptions) {
            if (this.hasOwnProperty(option)) {
                this[option] = modelOptions[option];
            }
        }
    }
    ownerObject(session) {
        if (!this.ownerKey) {
            throw new ReferenceError('Owner key is undefined or null.');
        }
        if (!session) {
            throw new ReferenceError('Session data is undefined or null.');
        }
        if (!session.uid) {
            throw new ReferenceError('User id is undefined or null.');
        }
        return { [this.ownerKey]: session.uid };
    }
    insert(data, options = {}) {
        if (options.reverse && this.dictionary) {
            data = this.reverse(data);
        }
        return (this.dictionary && options.translate) ?
            this.translator(this.model.create(data)) : this.model.create(data);
    }
    create(req, translate) {
        const options = { translate, reverse: true };
        this.createAuthMap && this.authMapper(req, this.createAuthMap);
        return this.insert(req.body, options);
    }
    findOne(query, options = {}) {
        let lean;
        if (options.lean) {
            lean = true;
        }
        return ((options.translate && this.dictionary) ? this.translator(this.model.findOne(query, { lean }))
            : this.model.findOne(query, { lean }));
    }
    findOneByID(req) {
        if (!this.checkID(req)) {
            return Promise.reject(new ReferenceError('Missing parameter: `id`.'));
        }
        const options = {
            translate: true,
            lean: true
        };
        return this.findOne({ _id: req.params.id }, options);
    }
    modify(query, data, options = {}) {
        if (options.data && options.data.reverse && this.dictionary) {
            data = this.reverse(data);
        }
        return ((this.dictionary && options.data && options.data.translate) ?
            this.translator(this.model.findOneAndUpdate(query, data, options.query)) :
            this.model.findOneAndUpdate(query, data, options.query));
    }
    patch(query, req, options = {}) {
        if (req.$owner) {
            const owner = this.ownerObject(req.session);
            query = Object.assign({}, query, owner);
        }
        if (req.query && utils_1.$$.strToBool(req.query.current)) {
            if (!options.query) {
                options.query = {};
            }
            options.query['new'] = true;
        }
        return this.modify(query, req.body, options);
    }
    patchByID(req) {
        const options = {
            data: { translate: true, reverse: true },
            query: { new: true }
        };
        return this.checkID(req) ? this.patch({ _id: req.params.id }, req, options) :
            Promise.reject(new ReferenceError('Missing parameter: `id`.'));
    }
    delete(query, translate) {
        return ((translate && this.dictionary) ? this.translator(this.model.findOneAndRemove(query))
            : this.model.findOneAndRemove(query));
    }
    deleteByID(req) {
        if (!this.checkID(req)) {
            return Promise.reject(new ReferenceError('Missing parameter: `id`.'));
        }
        return this.delete({ _id: req.params.id }).then(data => {
            return undefined;
        });
    }
    rollback(id, data, insert, options) {
        if (insert && data) {
            options = Object.assign({ query: { upsert: true } }, options);
        }
        if (data) {
            return this.modify({ _id: id }, data, options);
        }
        return this.delete({ _id: id }).then(doc => {
            return null;
        });
    }
    translator(promise) {
        return promise.then(this.translate);
    }
    checkID(req) {
        return !!(req && req.params && req.params.id);
    }
    authMapper(req, map) {
        if (!req.session) {
            return;
        }
        for (let key in map) {
            if (req.session[key]) {
                req.body[key] = req.session[key];
            }
            else {
                throw new ReferenceError(key + ' does not exist on session');
            }
        }
    }
    static create(name) {
        const models = di_1.DI.inject('Models');
        const [model, modelDef] = [models.model(name), models.modelDef(name)];
        return new Model(model, modelDef);
    }
}
exports.Model = Model;
