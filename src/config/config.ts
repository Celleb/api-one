/**
 * config.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { Config } from '../core';
import { OPERATORS } from './default-operators';
import { SCHEMA_OPTIONS } from './default-schema-options';

export const CONFIG: Config = {
    name: 'API-ONE',
    port: 8080,
    env: 'development',
    rootware: {
        bodyParser: true,
        methodOverride: true,
        morgan: true,
        compression: true,
        helmet: true,
        csurf: true
    },
    dbConfig: {
        name: 'ApiOne',
        host: 'localhost',
        port: 27017
    },
    operators: OPERATORS,
    schemaOptions: SCHEMA_OPTIONS
}