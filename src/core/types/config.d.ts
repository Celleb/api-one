/**
 * Config type interface
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DatabaseConfig } from '../';
import { Operators, DefaultSchemaOptions } from '../../config';
import * as mongoose from 'mongoose';

export interface Config {
    name?: string;
    port?: number;
    env?: string;

    rootware?: {
        bodyParser?: boolean;
        methodOverride?: boolean;
        morgan?: boolean;
        compression?: boolean;
        helmet?: boolean;
        csurf: boolean;
    },
    dbConfig?: DatabaseConfig | DatabaseConfig[],
    operators?: Operators,
    schemaOptions?: DefaultSchemaOptions
}
