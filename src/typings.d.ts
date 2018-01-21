/**
 * typings.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import * as express from 'express';
import { Session } from './core';
declare module 'express' {
    interface Request {
        $session: { [key: string]: any };
        session: Session;
        $owner: boolean;
    }
}
