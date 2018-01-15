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
    translator(promise) {
        return promise.then(this.translate);
    }
    static create(name) {
        const models = di_1.DI.inject('Models');
        const [model, modelDef] = [models.model(name), models.modelDef(name)];
        return new Model(model, modelDef);
    }
}
exports.Model = Model;
