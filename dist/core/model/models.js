'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
class Models {
    constructor(db) {
        this.db = db;
        this.models = [];
    }
    add(name, schema, schemaDef, options) {
        this.db.model(name, schema);
        this.models.push({
            name,
            schema,
            schemaDef,
            options
        });
        return this;
    }
    model(name) {
        return this.db.model(name);
    }
    modelDef(name) {
        return this.models.find((model) => {
            return (model.name === name);
        });
    }
    static create() {
        return (new Models(di_1.DI.inject('Database')));
    }
}
exports.Models = Models;
