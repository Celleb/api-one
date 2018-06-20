/**
 * output-handler.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;

const OutputHandlers = require('../output-handlers').OutputHandlers;

describe('OutputHandlers', function () {
    it('should be a class', function () {
        expect(OutputHandlers).to.be.a('function');
    });


    describe('#json', function () {
        expect(OutputHandlers.json).to.be.a('function');
    });
});