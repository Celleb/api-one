"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = {
    useMongoClient: true,
    config: {
        autoIndex: false
    },
    promiseLibrary: global.Promise,
    keepAlive: 120,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    bufferMaxEntries: 0
};
