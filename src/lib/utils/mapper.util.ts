/**
 * mapper.util.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Dictionary, Data } from '../../core/types';
import * as _ from 'lodash';
import { $$ } from './';

export class Mapper {

    /**
     * Overrides the keys of an object to the keys specified by the dictionary values.
     * @param data
     * @param dictionary
     */
    static mapper(data: Data, dictionary: Dictionary): Data {
        let mappedData = {};
        if (_.isEmpty(dictionary)) {
            return data;
        }
        for (let key in data) {
            if (!dictionary.hasOwnProperty(key)) {
                mappedData[key] = data[key];
                continue;
            }
            const value = dictionary[key];
            // check for objects
            if ($$.isRealObject(value) && $$.isRealObject(data[key]) && (<any>value)._id) {
                mappedData[(<any>value)._id] = this.mapper(data[key], <any>value);
                continue;
            } else if ($$.isRealObject(value)) {
                mappedData[key] = data[key];
                continue;
            }
            mappedData[value] = data[key];
        }
        return mappedData;
    }

    /**
     * Overrides the keys of an object or collection to the keys specified by the dictionary values.
     * @param data - A collection or object
     * @param dictionary
     */
    static map(data: Data | Data[], dictionary: Dictionary): Data | Data[] {
        return Array.isArray(data) ? _.map(data, values => {
            return this.mapper(values, dictionary);
        }) : this.mapper(data, dictionary);
    }

    /**
     * Inverts the keys and values of a dictionary.
     * @param dictionary
     */
    static invert(dictionary: Dictionary): Dictionary {
        let invertedDictionary = {};
        for (let key in dictionary) {
            const value = dictionary[key];
            if ($$.isRealObject(value) && (<any>value)._id) {
                invertedDictionary[(<any>value)._id] = this.invert(_.omit(<any>value, ['_id']));
                invertedDictionary[(<any>value)._id]['_id'] = key;
                continue;
            }
            invertedDictionary[value] = key;
        }
        return invertedDictionary;
    }

    /**
     * Returns the value of the specified property/key in the specified dictionary.
     * Returns null if the dictionary is not given or the property/key does not exist.
     * @param key
     * @param dictionary
     */
    static getKeyValue(key: string, dictionary: Dictionary): string {
        if (!dictionary || !dictionary[key]) {
            return null;
        }
        if ($$.isRealObject(dictionary[key])) {
            return dictionary[key]._id || null;
        }
        return dictionary[key];
    }


}
