"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(schemaDef, dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = dictionary;
    }
    limit(limit) {
        const $limit = Number.isInteger(+limit) ? +limit : 1000;
        return { $limit };
    }
    skip(skip) {
        const $skip = Number.isInteger(+skip) ? +skip : 0;
        return { $skip };
    }
    static create(schemaDef, dictionary) {
        return new QueryBuilder(schemaDef, dictionary);
    }
}
exports.QueryBuilder = QueryBuilder;
