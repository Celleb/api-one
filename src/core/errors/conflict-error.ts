/**
 * conflict-error.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { ApiOneError } from './api-one-error';

export class ConflictError extends ApiOneError {

    constructor(opts: { [x: string]: any } | string) {
        let code = 422;
        let message = 'Resource conflict occured';

        if (typeof opts === 'object') {
            message = opts.message || message;
            code = opts.code || code;
        } else {
            message = opts as string;
        }


        super(message, code);

        this.name = 'ConflictError';
    }

}