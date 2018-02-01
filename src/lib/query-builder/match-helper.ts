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

    /**
     * Extracts a key and value(s) from a specified string using a specified seperator and
     * returns them as an array. It also translates the key if found in the dictionary.
     * @param string
     * @param seperator
     * @returns An array with the first values as the key and the second value as the value(s).
     */
    getKeyAndValues(string: string, seperator: string): [string, string | string[]] {
        const point = string.indexOf(seperator);
        let key = string.substring(0, point);
        let value: string | string[] = string.substring(point + seperator.length);

        key = Mapper.getKeyValue(key, this.dictionary) || key;

        value = (value.indexOf(',') !== -1) ? $$.split(value, ',') : value;

        return [key, value];
    }

    /**
     * Converts a value to the type specified by the key in the Schema Definition.
     * Otherwise it returns the value in the original type.
     * @param value
     * @param key
     */
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

    /**
     * Creates and returns an object that specifies an equality condition.
     * If `value` is an array a $in condition is created to match any value in the array.
     * @param key
     * @param value
     */
    equal(key: string, value: any): object {
        value = this.typify(value, key);
        if (Array.isArray(value)) {
            return { [key]: { $in: value } };
        }
        return { [key]: value };
    }

    /**
     * Creates and returns an object that specifies a not equal condition.
     * If `value` is an array a $nin condition is created to exclude any value in the array.
     * @param key
     * @param value
     */
    notEqual(key: string, value: any): object {
        value = this.typify(value, key);
        if (Array.isArray(value)) {
            return { [key]: { $nin: value } };
        }
        return { [key]: { $ne: value } };
    }

    /**
     * Creates and returns an object that specifies a greate or equal condition.
     * @param key
     * @param value
     */
    greaterOrEqual(key: string, value: any): object {
        value = this.typify(value, key);
        return { [key]: { $gte: value } };
    }
}
