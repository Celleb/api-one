/**
 * data-options.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';
export interface DataOptions {
    exclude?: string[];
    translate?: boolean;
    reverse?: boolean;
}

export interface UpdateOptions {
    data?: DataOptions;
    query?: mongoose.QueryUpdateOptions;
}

export interface FindOptions {
    translate?: boolean;
    lean?: boolean;
    preMatch?: { [key: string]: any };
}