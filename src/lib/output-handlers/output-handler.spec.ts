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

const OutputHandlers = require('../dist/lib/').OutputHandlers;

function createHandler() {
    return OutputHandlers.create();
}

describe('OutputHandlers', function () {
    it('should be a class', function () {
        expect(OutputHandlers).to.be.a('function');
    });

    describe('#create', function () {
        it('creates an instance of OutputHandlers', function () {
            const handler = createHandler();
            expect(handler).to.be.an.instanceOf(OutputHandlers);
        });
    });

    describe('.json', function () {
        const handler = createHandler();
        expect(handler.json).to.be.a('function');
    });
});