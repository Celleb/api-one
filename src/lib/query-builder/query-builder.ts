/**
 * query-builder.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as mongoose from 'mongoose';
import { Dictionary } from '../../core';

export class QueryBuilder {

    private schemaDef: mongoose.SchemaDefinition;
    private dictionary: Dictionary;

    constructor(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = dictionary;
    }

    /**
     * Creates a limit stage for the aggregation pipeline from the given numberic input.
     * Strings will be converted to their equivalent numberic values
     * @param {string| number} limit
     * @returns {object}
     */
    limit(limit: string | number): object {
        const $limit = Number.isInteger(+limit) ? +limit : 1000;
        return { $limit };
    }

    static create(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        return new QueryBuilder(schemaDef, dictionary);
    }
}
