/**
 * route-config.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { Handler } from 'express';

export interface RouteConfig {
    path: string;
    model?: string;
    authentication?: Array<string> | boolean;
    methods?: Array<string>;
    authorization?: {
        permissionID: string;
        permissions?: object;
    },
    preWare?: {
        post?: Handler | Handler[],
        get?: Handler | Handler[],
        update?: Handler | Handler[],
        delete?: Handler | Handler[],
        patch?: Handler | Handler[]
    },
    postWare?: {
        post?: Handler | Handler[],
        get?: Handler | Handler[],
        update?: Handler | Handler[],
        delete?: Handler | Handler[],
        patch?: Handler | Handler[]
    }
}