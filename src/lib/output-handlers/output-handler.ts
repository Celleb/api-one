/**
 * output-handler.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as express from 'express';

export class OutputHandlers {

    private static handler: OutputHandlers;
    private constructor() {

    }

    static json(res: express.Response, req: express.Response, feedback?) {
        if (feedback) {
            return res.status(200).json(feedback).end();
        } else if (res.$output) {
            return res.status(200).json(res.$output).end();
        } else {
            return res.status(201).end();
        }

    }

}