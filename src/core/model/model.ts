/**
 * model.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Data } from '../types';
import { DI } from '../di';

import * as mongoose from 'mongoose';
import { ModelDefinition, ModelOptions, Dictionary, Session, InsertOptions, Models } from '../';
import { Mapper } from '../../lib/utils';

export class Model implements ModelOptions {
    private model: mongoose.Model<any>;
    dictionary: Dictionary = null;
    readExclude?: Array<string> = null;
    createExclude?: Array<string> = null;
    updateAuthMap?: { [key: string]: string } = null;
    ownerKey?: string = null;
    exclusive?: Array<string> = null;
    createAuthMap?: { [key: string]: string } = null;
    schemaDef: mongoose.SchemaDefinition = null;
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

    insert(data: Data | Data[], options: InsertOptions = {}): Promise<mongoose.Document | mongoose.Document[]> {
        if (options.reverse && this.dictionary) {
            data = this.reverse(data);
        }
        return (this.dictionary && options.translate) ?
            this.translator(this.model.create(data)) : this.model.create(data);
    }

    private translator(promise: Promise<any>): Promise<mongoose.Document | mongoose.Document[]> {
        return promise.then(this.translate);
    }

    /**
     * Converts api keys to database keys.
     * @param {Data} data - User data
     * @param {Dictionary} dictionary - Dictionary
     * @returns {mongoose.Document}
     */
    reverse = (data: Data | Data[], dictionary?: Dictionary): Data | Data[] => {
        dictionary = dictionary ? dictionary : this.dictionary;
        dictionary = Mapper.invert(dictionary);
        return Mapper.map(data, dictionary) as mongoose.Document;
    }

    /**
     * Converts database keys to api keys
     * @param {mongoose.Document} data - Data from database
     * @param {Dictionary} dictionary - Dictionary
     * @returns {mongoose.Document}
     */
    translate = (data: mongoose.Document | mongoose.Document[], dictionary?: Dictionary): mongoose.Document | mongoose.Document[] => {
        dictionary = dictionary ? dictionary : this.dictionary;
        return Mapper.map(data, dictionary) as mongoose.Document;
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
