/**
 * default-options.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { ConnectionOptions } from 'mongoose';

export const defaultOptions: ConnectionOptions = {
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
