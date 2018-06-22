/**
 * notfound-error.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { ApiOneError } from './api-one-error';

export class NotFoundError extends ApiOneError {

    constructor(opts: { [x: string]: any } | string) {
        let code = 404;
        let message = 'The resource you are looking could not be found.';

        if (typeof opts === 'object') {
            message = opts.message || message;
            code = opts.code || code;
        }

        message = opts as string;

        super(message, code);

        this.name = 'NotFoundError';
    }

}