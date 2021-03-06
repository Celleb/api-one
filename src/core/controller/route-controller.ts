
/**
 * controller.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as express from 'express';
import { METHODS } from '../../config';
import { Config } from '../types/config';
import { Model } from '../model/model';
import { RouteConfig } from '../types';
import { NotFoundError } from '../errors';

export class RouteController {

    private config: Config;
    private model: Model;
    private routeConfig: RouteConfig;
    private router: express.Router;
    private constructor(config: Config, model: Model, routeConfig: RouteConfig) {
        this.config = config;
        this.model = model;
        this.routeConfig = routeConfig;
        this.router = express.Router();
    }

    /**
     * Returns the router.
     */
    getRouter(): express.Router {
        this.attachHandlers();

        return this.router;
    }

    /**
     * Attach route handlers to the router.
     */
    private attachHandlers() {

        for (let method of METHODS) {
            if (!this.routeConfig.methods || (this.routeConfig.methods.indexOf(method) !== -1)) {

                switch (method) {
                    case 'get': this.get();
                        break;
                    case 'delete': this.delete();
                        break;
                    case 'patch': this.patch();
                        break;
                    case 'post': this.post();
                }
            }
        }
    }

    /**
     * Adds handler(s) for a get request to the router.
     */
    private get() {

        // get a single doc
        this.router.get('/:id', this.preWare('get'), (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.model.findOneByID(req).then(doc => {
                const item = this.routeConfig.name ? this.routeConfig.name : 'Item ';
                if (!doc) {
                    next(new NotFoundError({ message: item + ' could not be found.' }))
                }
                res.$output = doc;
                next();
            });

        }, this.postWare('get'), this.outputHandler);

        // get all docs
        this.router.get('/', this.preWare('get'), (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.model.findAll(req).then(doc => {
                res.$output = doc;
                next();
            });

        }, this.postWare('get'), this.outputHandler);
    }

    /**
     * Adds handler(s) for a delete request to the router.
     */
    private delete() {

        // get a single doc
        this.router.delete('/:id', this.preWare('delete'), (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.model.deleteByID(req).then(doc => {
                res.$output = doc;
                next();
            });

        }, this.postWare('delete'), this.outputHandler);

    }

    /**
     * Handler for returning output to the client.
     * @param req 
     * @param res 
     */
    private outputHandler(req: express.Request, res: express.Response) {
        res.$json(res, res);
    }

    /**
     * Returns handler(s)/middleware that should run before the main request handler.
     * @param method 
     */
    private preWare(method: string) {
        if (!this.routeConfig.preWare || !this.routeConfig.preWare[method]) {
            return (req: express.Request, res: express.Response, next: express.NextFunction) => {
                next();
            }
        }

        return this.routeConfig.preWare[method];
    }

    /**
     * Adds handler(s) for a post request to the router.
     */
    private patch() {
        this.router.patch('/:id', this.preWare('patch'), (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.model.patchByID(req).then(doc => {
                res.$output = doc;
                next();
            });

        }, this.postWare('patch'), this.outputHandler);
    }

    /**
     * Adds handler(s) for a post request to the router.
     */
    private post() {
        this.router.post('/', this.preWare('post'), (req: express.Request, res: express.Response, next: express.NextFunction) => {

            this.model.create(req, true).then(doc => {
                res.$output = doc;
                next();
            }).catch(next);

        }, this.postWare('post'), this.outputHandler);
    }


    /**
     * Returns handler(s)/middleware that should run after the main request handler.
     * @param method
     */
    private postWare(method: string): express.Handler {
        if (!this.routeConfig.postWare || !this.routeConfig.postWare[method]) {
            return (req: express.Request, res: express.Response, next: express.NextFunction) => {
                next();
            }
        }

        return this.routeConfig.preWare[method];
    }


    /**
     * Creates a new instance of RouteControllers and return an express Router.
     * @param routeConfig 
     */
    static create(routeConfig: RouteConfig, model: Model, config: Config): express.Router {
        // const models = DI.inject('Models');
        // const config = DI.inject('Config');

        const rc = new this(config, model, routeConfig);

        return rc.getRouter();

    }


}