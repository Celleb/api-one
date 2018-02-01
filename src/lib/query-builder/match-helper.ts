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
import { $$, Mapper } from '../utils';
import { Operators } from '../../config';

export class MatchHelper {
    private schemaDef: mongoose.SchemaDefinition;
    private dictionary: Dictionary;
    @Inject()
    operators: Operators;
    constructor(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = Mapper.invert(dictionary);
    }

    getKeyAndValues(string: string, seperator: string): [string, string | string[]] {
        const point = string.indexOf(seperator);
        let key = string.substring(0, point);
        let value: string | string[] = string.substring(point + seperator.length);

        key = Mapper.getKeyValue(key, this.dictionary) || key;

        value = (value.indexOf(',') !== -1) ? $$.split(value, ',') : value;

        return [key, value];
    }

    typify(value: string, key: string): any {
        if (Array.isArray(value)) {
            let values = [];
            value.forEach(val => {
                values.push(this.typify(val, key));
            });
            return values;
        }

        if (this.schemaDef[key] && (this.schemaDef[key] === Number || (<any>this.schemaDef[key]).type === Number)) {
            return +value;
        }

        if (this.schemaDef[key] && (this.schemaDef[key] === Date || (<any>this.schemaDef[key]).type === Date)) {
            return new Date(value);
        }

        return value;
    }
}
