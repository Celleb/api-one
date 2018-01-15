/**
 * model.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DI } from '../di';

import * as mongoose from 'mongoose';
import { ModelDefinition, ModelOptions, Dictionary, Session, InsertOptions, Models } from '../';

export class Model implements ModelOptions {
    private model: mongoose.Model<any>;
    dictionary: Dictionary;
    readExclude?: Array<string>;
    createExclude?: Array<string>;
    updateAuthMap?: { [key: string]: string };
    ownerKey?: string;
    exclusive?: Array<string>;
    createAuthMap?: { [key: string]: string };
    schemaDef: mongoose.SchemaDefinition;
    constructor(model: mongoose.Model<any>, modelDef: ModelDefinition) {
        this.model = model;
        this.schemaDef = modelDef.schema;
        this.expandOptions(modelDef.options);
    }

    private expandOptions(modelOptions: ModelOptions): void {
        for (let option in modelOptions) {
            if (this.hasOwnProperty(option)) {
                this[option] = modelOptions[option];
            }
        }
    }

    ownerObject(session: Session): { [key: string]: any } {
        if (!this.ownerKey) {
            throw new ReferenceError('Owner key is undefined or null.');
        }
        if (!session) {
            throw new ReferenceError('Session data is undefined or null.');
        }
        if (!session.uid) {
            throw new ReferenceError('User id is undefined or null.');
        }
        return { [this.ownerKey]: session.uid };
    }

    insert(data: any, options: InsertOptions): Promise<mongoose.Document> {
        if (options.reverse) {
            return;
        }
    }

    reverse(data: { [key: string]: any }, exclude: string[] = [], dictionary?: Dictionary): { [key: string]: any } {
        dictionary = dictionary || this.dictionary;
        let reversedData = {};
        for (let key in this.dictionary) {
            if (Array.isArray(dictionary[key]) && Array.isArray(data[key])) {
                reversedData[key] = this.reverse(data[key], [], dictionary);
            } else {
                reversedData[key] = data[key];
            }
        }
        return reversedData;
    }


    /**
     * Creates a new Model
     * @param {string} name - The name of the model
     * @returns {Model}
     */
    static create(name: string): Model {
        const models: Models = DI.inject('Models');
        const [model, modelDef] = [models.model(name), models.modelDef(name)];
        return new Model(model, modelDef);
    }


}
