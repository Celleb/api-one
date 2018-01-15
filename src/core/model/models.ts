/**
 * model.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
import * as mongoose from 'mongoose';
import { Database } from '../../lib/database/database';
import { ModelOptions, ModelDefinition } from '../types';
import { DI } from '../di';

export class Models {
    private db: mongoose.Connection;
    private models: ModelDefinition[];
    private constructor(db: mongoose.Connection) {
        this.db = db;
        this.models = [];
    }


    /**
     * Adds the model definition and defines the mongoose model on the database connection.
     * @param name - The name of the model
     * @param schema - Mongoose schema
     * @param schemaDef - Mongoose Schema Definition
     * @param options - Model options
     */
    add(name: string, schema: mongoose.Schema, schemaDef: mongoose.SchemaDefinition, options: ModelOptions): Models {
        this.db.model(name, schema);
        this.models.push({
            name,
            schema,
            schemaDef,
            options
        });
        return this;
    }

    /**
     * Retrieves a mongoose model for the given name.
     * @param {string} name - The name of the model
     * @returns mongoose model
     */
    model(name: string): mongoose.Model<any> {
        return this.db.model(name);
    }

    /**
     * Retrieves and returns the model definition.
     * @param {string} name - The name of the model
     */
    modelDef(name: string): ModelDefinition | undefined {
        return this.models.find((model: ModelDefinition) => {
            return (model.name === name);
        });
    }

    /**
     * Creates a new model instance
     */
    static create(): Models {
        return (new Models(DI.inject('Database')));
    }

}
