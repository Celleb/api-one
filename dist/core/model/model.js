'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var di_1 = require("../di");
var Model = (function () {
    function Model(db, defaultSchemaOptions, name, schema, dictionary, options) {
        this.db = db;
        this.name = name;
        this.schema = schema;
        this.options = options;
        var schemaOptions = Object.assign({}, defaultSchemaOptions, options.schemaOptions);
        this.mongooseSchema = new mongoose.Schema(this.schema, schemaOptions);
    }
    Model.prototype.createIndex = function (index, options) {
        this.mongooseSchema.index(index, options);
    };
    Model.prototype.getModel = function () {
        return {
            model: this.db.model(this.name, this.mongooseSchema),
            config: this.options,
            schema: this.schema
        };
    };
    Model.create = function (name, schema, dictionary, options) {
        return (new Model(di_1.DI.inject('Database'), di_1.DI.inject('DefaultSchemaOptions'), name, schema, dictionary, options));
    };
    return Model;
}());
exports.Model = Model;
