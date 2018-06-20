/**
 * users.def.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { SchemaDefinition } from 'mongoose';
import { ModelDefinition } from '../../src/core/types';
import { Schema } from '../../src/core/model/schema';

const schemaDef: SchemaDefinition = {
    _id: { type: Number },
    name: { type: String },
    lastname: { type: String },
    date: { type: Date, default: Date.now }
}

export const UsersModelDefinition: ModelDefinition = {
    schema: Schema.create(schemaDef).getSchema(),
    name: 'users',
    schemaDef
};