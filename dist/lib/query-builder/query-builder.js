"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(schemaDef, dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = dictionary;
    }
    static create(schemaDef, dictionary) {
        return new QueryBuilder(schemaDef, dictionary);
    }
}
exports.QueryBuilder = QueryBuilder;
