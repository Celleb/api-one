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

    static create(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        return new QueryBuilder(schemaDef, dictionary);
    }
}
