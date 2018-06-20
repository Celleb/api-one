/**
 * attachment.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as express from 'express';
import { OutputHandlers } from '../../lib/output-handlers';


/**
 * Adds objects and functions to the express request and response object.
 * @param req 
 * @param res 
 * @param next 
 */
export function attachments(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.$json = OutputHandlers.json;
    next();
}