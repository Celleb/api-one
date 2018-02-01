/**
 * match-helper.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as mongoose from 'mongoose';
import { Dictionary, Inject } from '../../core';
import { $$ } from '../utils/core.util';
import { Operators } from '../../config';

export class MatchHelper {
    private schemaDef: mongoose.SchemaDefinition;
    private dictionary: Dictionary;
    @Inject()
    operators: Operators;
    constructor(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = dictionary;
    }

    getKeyAndValues(string: string, seperator: string): [string, string | string[]] {
        const point = string.indexOf(seperator);
        const key = string.substring(0, point);
        let value: string | string[] = string.substring(point + seperator.length);
        value = (value.indexOf(',') !== -1) ? $$.split(value, ',') : value;
        return [key, value];
    }
}
