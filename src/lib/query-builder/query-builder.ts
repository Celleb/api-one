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
import { Mapper, $$ } from '../utils';

export class QueryBuilder {

    private schemaDef: mongoose.SchemaDefinition;
    private dictionary: Dictionary;
    private iDictionary: Dictionary;
    private sortValues = { asc: 1, desc: -1 };

    constructor(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        this.schemaDef = schemaDef;
        this.dictionary = dictionary;
        this.iDictionary = Mapper.invert(this.dictionary);
    }

    /**
     * Creates a limit stage for the aggregation pipeline from the given numberic input.
     * Strings will be converted to their equivalent numeric values.
     * @param limit
     */
    limit(limit: string | number): object {
        const $limit = Number.isInteger(+limit) ? +limit : 1000;
        return { $limit };
    }

    /**
     * Creates a skip stage for the aggregation pipeline from the given numeric input.
     * String will be converted to their equivalent numeric values.
     * @param skip
     */
    skip(skip: string | number): object {
        const $skip = Number.isInteger(+skip) ? +skip : 0;
        return { $skip };
    }

    /**
     * Creates a sort stage for the aggregation pipeline from the given string.
     * @param sort - A string with supported key values.
     */
    sort(sort: string): object {
        let $sort = null;
        if (sort.indexOf('$meta') !== -1) {
            $sort = { $meta: 'textScore' };
            if (sort === '$meta') {
                return { $sort };
            }
        }
        if (sort.indexOf('$natural') !== -1) {
            const [, value] = $$.split(sort, ':');
            if (this.sortValues.hasOwnProperty(value)) {
                return { $sort: { $natural: this.sortValues[value] } };
            }
            return null;
        }
        return this.sortByItems(sort, $sort);
    }

    /**
     * Creates and returns a project stage for the aggregation pipeline from given string.
     * @param include - A string with supported values to include.
     */
    include(include: string): object {
        const values = $$.split(include);
        let $project = null;
        values.forEach(value => {
            value = this.dictValue(value, this.iDictionary) || value;
            $project = $project || {};
            $project[value] = true;
        });
        return { $project };
    }

    /**
     * Returns the value of the specified property/key in the specified dictionary.
     * Returns null if the dictionary is not given or the property/key does not exist.
     * @param key
     * @param dictionary
     */
    private dictValue(key: string, dictionary: Dictionary): string {
        if (!dictionary || !dictionary[key]) {
            return null;
        }
        if ($$.isRealObject(dictionary[key])) {
            return dictionary[key]._id || null;
        }
        return dictionary[key];
    }

    /**
     * Creates a sort object
     * @param sort
     */
    private sortByItems(sort: string, $sort?): object {
        const values = $$.split(sort, ';');
        for (let current of values) {
            let [key, value] = $$.split(current, ':');
            if (!(key && value && this.sortValues.hasOwnProperty(value))) {
                continue;
            }
            $sort = $sort || {};
            key = this.dictValue(key, this.iDictionary) || key;
            value = this.sortValues[value];
            $sort[key] = value;
        }
        return $sort ? { $sort } : null;
    }

    /**
     * Creates a new instance of the QueryBuilder
     * @param schemaDef - Schema Definition
     * @param dictionary - Dictionary
     */
    static create(schemaDef: mongoose.SchemaDefinition, dictionary?: Dictionary) {
        return new QueryBuilder(schemaDef, dictionary);
    }
}
