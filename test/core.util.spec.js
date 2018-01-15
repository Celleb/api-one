/**
 * core.util.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var expect = chai.expect;
var $$ = require('../dist/lib/utils').CoreUtilities;
describe('CoreUtilities', function () {
    describe('#isObject', function () {
        it('returns true if the input is an object', function () {
            expect($$.isObject(Object())).to.be.ok;
            expect($$.isObject({})).to.be.ok;
            expect($$.isObject([])).to.be.ok;
        });
        it('returns false if the input is not an object', function () {
            expect($$.isObject('car')).to.not.be.ok;
            expect($$.isObject(null)).to.not.be.ok;
            expect($$.isObject(undefined)).to.not.be.ok;
            expect($$.isObject(1)).to.not.be.ok;
        });
    });
    describe('#isRealObject', function () {
        it('returns true if the input is an object', function () {
            expect($$.isRealObject(Object())).to.be.ok;
            expect($$.isRealObject({})).to.be.ok;
        });
        it('returns false if the input is not an object', function () {
            expect($$.isRealObject('car')).to.not.be.ok;
            expect($$.isRealObject(null)).to.not.be.ok;
            expect($$.isRealObject(undefined)).to.not.be.ok;
            expect($$.isRealObject(1)).to.not.be.ok;
            expect($$.isRealObject([])).to.not.be.ok;
        });
    });
});
