/**
 * model.mock.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */


export function getModel(data) {
    return {
        findOneAndUpdate: function (query, update) {
            const transData = { ...data };
            for (let key in update) {
                if (transData.hasOwnProperty(key)) {
                    transData[key] = update[key];
                }
            }
            return Promise.resolve(transData);
        },
        findOne: function (query, options) {
            return Promise.resolve(data);
        },
        findOneAndRemove: function (query) {
            return Promise.resolve(data);
        }, create: function (docs) {
            return Promise.resolve(docs);
        },
        aggregate: function (pipeline) {
            return Promise.resolve([data]);
        }
    };
}