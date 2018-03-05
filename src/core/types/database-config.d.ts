/**
 * database-config.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';

export interface DatabaseConfig {
    name: string;
    default?: boolean;
    uri?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    authSource?: string;
    queryOptions?: string;
    replicaSet?: {
        name: string;
        hosts: Array<string>
    };
    options?: mongoose.ConnectionOptions;
}
