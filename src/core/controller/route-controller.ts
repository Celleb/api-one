
/**
 * controller.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { Config, Model, RouteConfig, Models } from '../';
import { DI } from 'tsjs-di';

export class RouteController {

    private config: Config;
    private model: Model;
    private routeConfig: RouteConfig;
    constructor(config: Config, model: Model, routeConfig: RouteConfig) {
        this.config = config;
        this.model = model;
        this.routeConfig = routeConfig
    }

    /**
     * Creates a new instance of RouteControllers
     * @param routeConfig 
     */
    static create(routeConfig: RouteConfig): RouteController {
        const models = DI.inject('Models');
        const config = DI.inject('Config');

        return new this(config, models, routeConfig);
    }
}