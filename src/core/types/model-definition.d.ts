/**
 * model.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as mongoose from 'mongoose';
import { ModelOptions } from '../';
export interface ModelDefinition {
    schema: mongoose.Schema;
    name: string;
    schemaDef: mongoose.SchemaDefinition;
    options?: ModelOptions
}
