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
import * as express from 'express';
import { ModelDefinition, ModelOptions, Dictionary, Session, DataOptions, Models, UpdateOptions } from '../';
import { Mapper, $$ } from '../../lib/utils';

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

    /**
     * Inserts a new document(s) into the database
     * @param {Data | Data[]} data
     * @param {InsertOptions} options
     * @returns {mongoose.Document | mongoose.Document[]}
     */
    insert(data: Data | Data[], options: DataOptions = {}): Promise<mongoose.Document | mongoose.Document[]> {
        if (options.reverse && this.dictionary) {
            data = this.reverse(data);
        }
        return (this.dictionary && options.translate) ?
            this.translator(this.model.create(data)) : this.model.create(data);
    }

    create(req: express.Request, translate?: boolean): Promise<mongoose.Document | mongoose.Document[]> {
        const options: DataOptions = { translate, reverse: true };
        this.createAuthMap && this.authMapper(req, this.createAuthMap);
        return this.insert(req.body, options);
    }

    /**
     * Modifies a document in the db
     * @param {object} query - The query for the document to be matched.
     * @param {Data} data - The new data
     * @param {UpdateOptions} options - Update options
     * @returns {Promise<any>}
     */
    modify(query: object, data: Data | Data[], options: UpdateOptions = {}): any {
        if (options.data && options.data.reverse && this.dictionary) {
            data = this.reverse(data);
        }
        return (this.dictionary && options.data && options.data.translate) ?
            this.translator(this.model.findOneAndUpdate(query, data, options.query)) :
            this.model.findOneAndUpdate(query, data, options.query);
    }

    /**
     * Patches a document in the db
     * @param {object} query - The query for the document to be matched.
     * @param {express.Request} req - Express request object
     * @param {UpdateOptions} options - Update options
     * @returns {Promise<any>}
     */
    patch(query: object, req: express.Request, options: UpdateOptions = {}): Promise<any> {
        if (req.$owner) {
            const owner = this.ownerObject(req.session);
            query = { ...query, ...owner };
        }
        if (req.query && $$.strToBool(req.query.current)) {
            if (!options.query) {
                options.query = {};
            }
            options.query['new'] = true;
        }
        return this.modify(query, req.body, options);
    }

    /**
     * Patches a document match by the id parameter in the route
     * @param {express.Request} req - Express request object
     * @returns {Promise<any>}
     */
    patchByID(req: express.Request): Promise<any> {
        const options = {
            data: { translate: true, reverse: true },
            query: { new: true }
        };
        return this.checkID(req) ? this.patch({ _id: req.params.id }, req, options) :
            Promise.reject(new ReferenceError('Missing parameter: `id`.'));
    }

    delete(query: object, translate?: boolean): any {
        return (translate && this.dictionary) ? this.translator(this.model.findOneAndRemove(query))
            : this.model.findOneAndRemove(query);
    }

    deleteByID(req: express.Request): Promise<any> {
        if (!this.checkID(req)) {
            return Promise.reject(new ReferenceError('Missing parameter: `id`.'));
        }
        return this.delete({ _id: req.params.id }).then(data => {
            return undefined;
        });
    }

    /*** Utitilies below */
    private translator<T extends any>(promise: T): Promise<T> {
        return promise.then(this.translate);
    }

    private checkID(req: express.Request) {
        return !!(req && req.params && req.params.id);
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

    private authMapper(req: express.Request, map: { [key: string]: any }) {
        if (!req.session) {
            return;
        }
        for (let key in map) {
            if (req.session[key]) {
                req.body[key] = req.session[key];
            } else {
                throw new ReferenceError(key + ' does not exist on session');
            }
        }
    }

    /*** statics below */
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
