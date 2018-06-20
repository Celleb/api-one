/**
 * schema.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';
import { SCHEMA_OPTIONS } from '../../config/default-schema-options';

export class Schema {
    private schema: mongoose.Schema;
    private constructor(schemaDef: mongoose.SchemaDefinition, options: mongoose.SchemaOptions) {
        this.schema = new mongoose.Schema(schemaDef);
    }

    getSchema(): mongoose.Schema {

        return this.schema;
    }

    static create(schemaDef: mongoose.SchemaDefinition, options?: mongoose.SchemaOptions) {
        options = Object.assign({}, SCHEMA_OPTIONS, options);

        return (new this(schemaDef, options));
    }
}
