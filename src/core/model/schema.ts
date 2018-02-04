/**
 * schema.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DI } from 'tsjs-di';
import * as mongoose from 'mongoose';

export class Schema {
    private schema: mongoose.Schema;
    private constructor(schemaDef: mongoose.SchemaDefinition, options: mongoose.SchemaOptions) {
        this.schema = new mongoose.Schema(schemaDef);
    }

    getSchema(): mongoose.Schema {
        return this.schema;
    }

    static create(schemaDef: mongoose.SchemaDefinition, options?: mongoose.SchemaOptions) {
        const defaultOptions = DI.inject('DefaultSchemaOptions');
        options = Object.assign({}, defaultOptions, options);
        return (new this(schemaDef, options));
    }
}
