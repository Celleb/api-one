/**
 * error-handler.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import * as express from 'express';
import { HttpStatusCodes } from '../../config/http-status-codes';
import { ApiOneError } from '../../core/errors';
import { ErrorMessages } from '../../config/error-messages';

let status = 500;
let feedback: { [x: string]: any } = {};

export function errorHandler(error: Error | ApiOneError, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (res.headersSent) {
        return next(error);
    }
    switch (error.name) {
        case 'ValidatorError':
        case 'ValidationError':
            feedback.code = (error as ApiOneError).code || 2;
            status = HttpStatusCodes.UNPROCESSABLE_ENTITY;
            feedback.message = error.message ? error.message : ErrorMessages.validation;
            break;

        case 'MongoError':
            // [status, feedback] = mongoErrorHandler.resolve(err);
            break;

        case 'ForbiddenError':
            feedback.code = (error as ApiOneError).code || 3;
            status = HttpStatusCodes.FORBIDDEN;
            feedback.message = error.message ? error.message : ErrorMessages.unauthorized;
            break;

        case 'UnauthenticatedError':
            feedback.code = (error as ApiOneError).code;
            status = HttpStatusCodes.UNAUTHORIZED;
            feedback.message = error.message;
            break;

        case 'UnauthorizedError':
            feedback.code = (error as ApiOneError).code;
            status = HttpStatusCodes.FORBIDDEN;
            feedback.message = error.message;
            break;

        case 'ConflictError':
            feedback.code = (error as ApiOneError).code;
            status = HttpStatusCodes.CONFLICT
            feedback.message = error.message
            break;

        case 'UnavailableError':
            feedback.code = (error as ApiOneError).code;
            status = HttpStatusCodes.SERVICE_UNAVAILABLE;
            feedback.message = error.message;
            break;

        default:
            feedback.code = 0;
            status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
            feedback.message = ErrorMessages.serverError;
            break;
    }

    feedback.name = error.name || 'Unknown';

    return res.status(status).json(feedback).end();
}