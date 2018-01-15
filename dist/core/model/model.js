"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
class Model {
    constructor(model, modelDef) {
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
    insert(data, options) {
        if (options.reverse) {
            return;
        }
    }
    reverse(data, exclude = [], dictionary) {
        dictionary = dictionary || this.dictionary;
        let reversedData = {};
        for (let key in this.dictionary) {
            if (Array.isArray(dictionary[key]) && Array.isArray(data[key])) {
                reversedData[key] = this.reverse(data[key], [], dictionary);
            }
            else {
                reversedData[key] = data[key];
            }
        }
        return reversedData;
    }
    static create(name) {
        const models = di_1.DI.inject('Models');
        const [model, modelDef] = [models.model(name), models.modelDef(name)];
        return new Model(model, modelDef);
    }
}
exports.Model = Model;
