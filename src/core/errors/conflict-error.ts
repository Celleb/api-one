/**
 * conflict-error.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { ApiOneError } from './api-one-error';
import { HttpStatusCodes } from '../../config/http-status-codes';

export class ConflictError extends ApiOneError {

    constructor(opts: { [x: string]: any } | string) {
        let code = HttpStatusCodes.CONFLICT;;
        let message = 'This resource/items conflicts with an existing resource or item.';

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