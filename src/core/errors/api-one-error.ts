/**
 * api-one-error.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

export class ApiOneError extends Error {
    name: string;
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.message = message;
        this.stack = (new Error()).stack
    }

    toString() {
        return this.name + ': "' + this.message + '"';
    }
}