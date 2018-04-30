/**
 * app.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

// npm dependencies
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';
import * as morgan from 'morgan';
import * as debug from 'debug';
import { DI } from 'tsjs-di';
import { Application, Handler } from 'express';

// local dependencies
import { RouteConfig, Models, RouteController } from './';
import { Config, CONFIG, Operators } from '../config';
import { errorHandler } from '../lib/error-handler';

debug('api-one');

export class App {

    models: Models;
    private application: Application;
    private config: Config;

    constructor(config: Config) {
        this.application = express();
        this.config = { ...CONFIG, ...config };
        this.models = Models.create();
    }

    /**
     * Returns the express application instance.
     */
    get app() {
        return this.application;
    }

    /**
     * Adds a route handler to the express application
     * @param path - Route path
     * @param handler - Route handler
     */
    addRouteHandler(path: string, handler: Handler) {
        this.use(path, handler);

        return this;
    }

    /**
     * Creates routes and routes handlers and attaches them to the express application.
     * @param routes 
     */
    createRoutes(routes: RouteConfig | RouteConfig[]): App {
        if (Array.isArray(routes)) {
            for (let route of routes) {
                return this.createRoutes(route);
            }
        }

        const model = this.models.model((routes as RouteConfig).model);
        const routeHandler = RouteController.create(routes as RouteConfig, model, this.config);

        this.addRouteHandler((routes as RouteConfig).path, routeHandler);

        return this;
    }

    /**
     * Adds the error handler middleware to the express application.
     * Uses the default error handler if not specified.
     * @param errorHandler 
     */
    errorHandler(errorHandler?): App {
        errorHandler = errorHandler ? errorHandler : DI.inject('errorHandler');
        this.use(errorHandler);
        return this;
    }

    /**
     * Registers a dependency provider to the DI registery.
     * @param provider 
     */
    register(provider: any): App {
        DI.register(provider);
        return this;
    }

    /**
     * An alias to `app.use` but returns the instance of this application
     * @param args 
     */
    use(...args: any[]): App {
        this.application.use(...args);

        return this;
    }

    /**
     * Registers default dependency providers to the DI registry.
     */
    private defaultProviders(): App {

        debug('Adding operators');

        // register operator provider
        if (this.config.operators) {
            this.register({ provide: Operators, useValue: this.config.operators });
        }

        // register schemaOptions provider
        if (this.config.schemaOptions) {
            this.register({ provide: 'DefaultSchemaOptions', useValue: this.config.schemaOptions })
        }

        // register config
        this.register({ provide: Config, useValue: this.config });

        // default error handler
        this.register({ provide: 'errorHandler', useFuction: errorHandler });

        return this;
    }

    /**
     * Attaches root middleware to the express application.
     */
    private rootware(): void {
        this.config.rootware.helmet && this.use(helmet());
        this.config.rootware.methodOverride && this.use(methodOverride());
        this.config.rootware.bodyParser && this.use(bodyParser.urlencoded({
            extended: true
        })).use(bodyParser.json());
        this.config.rootware.csurf && this.use(csurf());
        this.config.rootware.compression && this.use(compression());
        this.config.rootware.morgan && this.use(morgan('combined'));
    }

}
