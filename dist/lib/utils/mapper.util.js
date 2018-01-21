"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _1 = require("./");
class Mapper {
    static mapper(data, dictionary) {
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
            if (_1.$$.isRealObject(value) && _1.$$.isRealObject(data[key]) && value._id) {
                mappedData[value._id] = this.mapper(data[key], value);
                continue;
            }
            else if (_1.$$.isRealObject(value)) {
                mappedData[key] = data[key];
                continue;
            }
            mappedData[value] = data[key];
        }
        return mappedData;
    }
    static map(data, dictionary) {
        return Array.isArray(data) ? _.map(data, values => {
            return this.mapper(values, dictionary);
        }) : this.mapper(data, dictionary);
    }
    static invert(dictionary) {
        let invertedDictionary = {};
        for (let key in dictionary) {
            const value = dictionary[key];
            if (_1.$$.isRealObject(value) && value._id) {
                invertedDictionary[value._id] = this.invert(_.omit(value, ['_id']));
                invertedDictionary[value._id]['_id'] = key;
                continue;
            }
            invertedDictionary[value] = key;
        }
        return invertedDictionary;
    }
}
exports.Mapper = Mapper;
