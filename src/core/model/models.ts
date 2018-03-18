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
import { Model } from './model';
import { DI } from 'tsjs-di';

export class Models {
    private db: mongoose.Connection;
    private modelDefs: Map<string, ModelDefinition>;
    private models: Map<string, Model>;
    private constructor(db: mongoose.Connection) {
        this.db = db;
        this.modelDefs = new Map();
        this.models = new Map()
    }


    /**
     * Adds the model definition and defines the mongoose model on the database connection.
     * @param modelDef
     */
    add(modelDef: ModelDefinition): Models {
        const model = this.db.model(modelDef.name, modelDef.schema);

        this.models.set(modelDef.name, Model.create(model, modelDef));
        this.modelDefs.set(modelDef.name, modelDef);

        return this;
    }

    /**
     * Retrieves a mongoose model for the given name.
     * @param {string} name - The name of the model
     * @returns mongoose model
     */
    model(name: string): Model {

        return this.models.get(name);
    }

    /**
     * Retrieves and returns the model definition.
     * @param {string} name - The name of the model
     */
    modelDef(name: string): ModelDefinition {

        return this.modelDefs.get(name);
    }

    /**
     * Creates a new model instance
     */
    static create(): Models {
        return (new Models(DI.inject('Database')));
    }

}
