/**
 * error-handler.spec.ts
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

const errorHandler = require('../dist/lib/error-handler').errorHandler;

let req = {

}

let res = {
    status: () => {
        return res;
    },
    json: (obj) => {
        return obj;
    }
}

function next(...args: any[]) {

}

describe('errorHandler', function () {
    it('should be a function', function () {
        expect(errorHandler).to.be.a('function');
    });

});