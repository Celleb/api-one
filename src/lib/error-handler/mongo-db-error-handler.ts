/**
 * mongo-db-error-handler.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { HttpStatusCodes } from "../../config/http-status-codes";
import { ErrorMessages } from "../../config/error-messages";

export function mongoDBErrorHandler(error): [number, { [key: string]: any }] {
    let status = 500;
    let feedback: { [key: string]: any };
    switch (error.code) {
        case 11000:
            status = HttpStatusCodes.CONFLICT;
            feedback = {
                message: 'This resource/items conflicts with an existing resource or item.',
                code: status,
                name: 'ConflictError'
            }
            break;
        default:
            feedback = {
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: ErrorMessages.serverError,
                name: 'Unknown'
            }
    }

    return [status, feedback];
}
