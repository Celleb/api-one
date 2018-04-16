/**
 * default-schema-options.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';

export class DefaultSchemaOptions implements mongoose.SchemaOptions {

}
export const SCHEMA_OPTIONS: DefaultSchemaOptions = {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    bufferCommands: false
};
