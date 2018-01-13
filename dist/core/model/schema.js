"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const mongoose = require("mongoose");
class Schema {
    constructor(schemaDef, options) {
        this.schema = new mongoose.Schema(schemaDef);
    }
    getSchema() {
        return this.schema;
    }
    static create(schemaDef, options) {
        const defaultOptions = di_1.DI.inject('DefaultSchemaOptions');
        options = Object.assign({}, defaultOptions, options);
        return (new this(schemaDef, options));
    }
}
exports.Schema = Schema;
