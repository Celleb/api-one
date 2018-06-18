/**
 * api-one-error.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;
const ApiOneError = require('../errors').ApiOneError;

describe('ApiOneError', function () {
    it('should be a function', function () {
        expect(ApiOneError).to.be.a('function');
    });

    it('should be an instance of Error', function () {
        expect(new ApiOneError('Error', 0)).to.be.an.instanceOf(Error);
    });

    it('should be an instance of ApiOneError', function () {
        const error = new ApiOneError('Error', 0)
        expect(error).to.be.an.instanceOf(ApiOneError);
        expect(error.code).to.eql(0);
        expect(error.message).to.eql('Error');
        expect(error).to.haveOwnProperty('stack');
    });

    it('is throwable', function () {
        expect(() => { throw new ApiOneError('Error, 0') }).to.throw(ApiOneError, 'Error');
    });

    it('convertable to string', function () {
        const error = new ApiOneError('Error', 0);
        expect(error.toString()).eqls('Error: "Error"');
    });

});