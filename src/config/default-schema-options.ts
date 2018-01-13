/**
 * default-schema-options.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';

export type DefaultSchemaOptions = mongoose.SchemaOptions;
export const defaultSchemaOptions: DefaultSchemaOptions = {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    bufferCommands: false
};
