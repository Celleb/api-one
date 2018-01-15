/**
 * model-options.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Dictionary } from './dictionary';
import * as express from 'express';
import * as mongoose from 'mongoose';

export interface MiddleWareObject {
    create?: express.Handler;
    read?: express.Handler;
    update?: express.Handler;
    delete?: express.Handler;
    patch?: express.Handler;
    all?: express.Handler;
}
export interface ModelOptions {
    dictionary: Dictionary;
    readExclude?: Array<string>;
    createExclude?: Array<string>;
    updateAuthMap?: { [key: string]: string };
    ownerKey?: string;
    middleware?: MiddleWareObject;
    exclusive?: Array<string>;
    createAuthMap?: { [key: string]: string };
}
