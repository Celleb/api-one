/**
 * model.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Data } from '../types';
import { DI } from 'tsjs-di';

import * as mongoose from 'mongoose';
import * as express from 'express';
import { ModelDefinition, ModelOptions, Dictionary, Session, DataOptions, Models, UpdateOptions, FindOptions } from '../';
import { Mapper, $$ } from '../../lib/utils';
import { QueryBuilder } from '../../lib';

export class Model implements ModelOptions {

    createAuthMap?: { [key: string]: string } = null;
    createExclude?: Array<string> = null;
    dictionary: Dictionary = null;
    exclusive?: Array<string> = null;
    iDictionary: Dictionary = null;
    model: mongoose.Model<any>;
    ownerKey?: string = null;
    readExclude?: Array<string> = null;
    schemaDef: mongoose.SchemaDefinition = null;
    updateAuthMap?: { [key: string]: string } = null;
    private qb: QueryBuilder;

    constructor(model: mongoose.Model<any>, modelDef: ModelDefinition) {
        this.model = model;
        this.schemaDef = modelDef.schemaDef;
        this.expandOptions(modelDef.options);
        this.qb = QueryBuilder.create(this.schemaDef, this.dictionary);
    }

    /**
     * Checks if the express request object has an id parameter.
     * @param {express.Request} req - Express request object.
     * @returns {boolean}
     */
    private checkID(req: express.Request) {

        return !!(req && req.params && req.params.id);
    }

    /**
     * Inserts a new document(s) into the database from the request body.
     * @param {express.Request} req - Express request object.
     * @param {boolean} translate - Flag to translate document keys from database keys to api keys.
     * @returns {Promise<mongoose.Document | mongoose.Document[]>}
     */
    create(req: express.Request, translate?: boolean): Promise<mongoose.Document | mongoose.Document[]> {
        const options: DataOptions = { translate, reverse: true };
        this.createAuthMap && this.authMapper(req, this.createAuthMap);

        return this.insert(req.body, options);
    }

    /**
     * Removes a document from the database that matches the query.
     * @param {object} query - The query for document to be matched.
     * @param {boolean} translate - Flag to translate document keys from database keys to api keys.
     * @returns {Promise<mongoose.Document>}
     */
    delete(query: object, translate?: boolean): Promise<mongoose.Document> {
        return ((translate && this.dictionary) ? this.translator(this.model.findOneAndRemove(query))
            : this.model.findOneAndRemove(query)) as Promise<any>;
    }

    /**
     * Removes a document from the database that matches the id in req.params.
     * @param {express.Request} req - Express request object.
     * @returns {Promise<mongoose.Document>}
     */
    deleteByID(req: express.Request): Promise<mongoose.Document> {
        if (!this.checkID(req)) {
            return Promise.reject(new ReferenceError('Missing parameter: `id`.'));
        }

        return this.delete({ _id: req.params.id }).then(data => {
            return undefined;
        });
    }

    /**
     * Returns all documents that matches the specified query.
     * @param req - Express request object
     * @param options 
     */
    find(req: express.Request, options: FindOptions = {}) {
        let pipeline = this.qb.build(req.query);
        if (options.preMatch) {
            pipeline.unshift({ $match: options.preMatch });
        }

        return (options.translate && this.dictionary) ? this.translator(this.model.aggregate(pipeline))
            : this.model.aggregate(pipeline);
    }

    /**
     * Returns all documents that matches the specified query with defualt options.
     * @param req - Express request object
     */
    findAll(req: express.Request) {

        let options: FindOptions = {
            translate: true
        }

        if (req.$owner) {
            options = { ...options, preMatch: this.ownerObject(req.session) };
        }

        return this.find(req, options);
    }

    /**
     * Returns a document that matches the query from the database.
     * @param {object} query - Query to match
     * @param {FindOptions} options - Find options
     * @returns {Promise<mongoose.Document>}
     */
    findOne(query: object, options: FindOptions = {}): Promise<mongoose.Document> {
        let lean: boolean;
        if (options.lean) {
            lean = true;
        }

        return ((options.translate && this.dictionary) ? this.translator(this.model.findOne(query, { lean }))
            : this.model.findOne(query, { lean })) as any;
    }

    /**
     * Returns a document with an _id that matches `req.params.id`
     * @param {express.Request} req - Express Request object.
     * @returns {Promise.<mongoose.Document>}
     */
    findOneByID(req: express.Request): Promise<mongoose.Document> {
        if (!this.checkID(req)) {
            return Promise.reject(new ReferenceError('Missing parameter: `id`.'));
        }
        const options = {
            translate: true,
            lean: true
        };

        return this.findOne({ _id: req.params.id }, options);
    }

    /**
     * Inserts a new document(s) into the database.
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


    /**
     * Modifies a document in the db
     * @param {object} query - The query for the document to be matched.
     * @param {Data} data - The new data
     * @param {UpdateOptions} options - Update options
     * @returns {Promise<any>}
     */
    modify(query: object, data: Data | Data[], options: UpdateOptions = {}): Promise<mongoose.Document> {
        if (options.data && options.data.reverse && this.dictionary) {
            data = this.reverse(data);
        }

        return ((this.dictionary && options.data && options.data.translate) ?
            this.translator(this.model.findOneAndUpdate(query, data, options.query)) :
            this.model.findOneAndUpdate(query, data, options.query)) as Promise<any>;
    }

    /**
     * Creates and returns an owner match object from the session.
     * @param {Session} session
     * @returns {Data}
     */
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
     * Patches a document in the db
     * @param {object} query - The query for the document to be matched.
     * @param {express.Request} req - Express request object
     * @param {UpdateOptions} options - Update options
     * @returns {Promise<mongoose.Document>}
     */
    patch(query: object, req: express.Request, options: UpdateOptions = {}): Promise<mongoose.Document> {
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
     * @returns {Promise<mongoose.Document>}
     */
    patchByID(req: express.Request): Promise<mongoose.Document> {
        const options = {
            data: { translate: true, reverse: true },
            query: { new: true }
        };

        return this.checkID(req) ? this.patch({ _id: req.params.id }, req, options) :
            Promise.reject(new ReferenceError('Missing parameter: `id`.'));
    }

    /**
     * Roles back changes made to the database.
     * @param {string|number} id - Document `_id`
     * @param {Data} data
     * @param {boolean} insert - A flag to reinsert a document.
     * @param {UpdateOptions} options
     * @returns {any}
     */
    rollback(id: string | number | null, data?: Data, insert?: boolean, options?: UpdateOptions): any {
        if (insert && data) {
            options = { ...{ query: { upsert: true } }, ...options };
        }

        if (data) {
            return this.modify({ _id: id }, data, options);
        }

        return this.delete({ _id: id }).then(doc => {
            return null;
        });
    }

    /**
     * Converts api keys to database keys.
     * @param {Data} data - User data
     * @param {Dictionary} dictionary - Dictionary
     * @returns {mongoose.Document}
     */
    reverse = (data: Data | Data[], dictionary?: Dictionary): Data | Data[] => {
        dictionary = dictionary ? dictionary : this.iDictionary;

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
     * Adds data to the request body from the session guided by the map
     * @param {express.Request} req - Express request object.
     * @param map
     */
    private authMapper(req: express.Request, map: { [key: string]: any }): void {
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

    private expandOptions(modelOptions: ModelOptions): void {
        for (let option in modelOptions) {
            if (this.hasOwnProperty(option)) {
                this[option] = modelOptions[option];
            }
        }

        if (this.dictionary) {
            this.iDictionary = Mapper.invert(this.dictionary);
        }
    }

    /*** Utitilies below */
    private translator<T extends any>(promise: T): Promise<T> {

        return promise.then(this.translate);
    }

    /*** statics below */
    /**
     * Creates a new Model
     * @param {string} name - The name of the model
     * @returns {Model}
     */
    static create(model: mongoose.Model<any>, modelDef: ModelDefinition): Model {

        return new Model(model, modelDef);
    }
}
