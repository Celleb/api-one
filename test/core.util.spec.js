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
    describe('#strToBool', function () {
        it('converts string `yes` to boolean true', function () {
            expect($$.strToBool('yes')).to.eql(true);
        });
        it('converts string `true` to boolean true', function () {
            expect($$.strToBool('true')).to.eql(true);
        });
        it('converts string `false` to boolean false', function () {
            expect($$.strToBool('false')).to.eql(false);
        });
        it('converts string `no` to boolean false', function () {
            expect($$.strToBool('no')).to.eql(false);
        });
        it('converts any other string to to null', function () {
            expect($$.strToBool('nnn')).to.eql(null);
            expect($$.strToBool('0')).to.eql(null);
        });
        it('returns the boolean if given a boolean', function () {
            expect($$.strToBool(true)).to.eql(true);
            expect($$.strToBool(false)).to.eql(false);
        });
    });
    describe('CoreUtilities#split', function () {
        it('splits a string into an array based on the delimitet', function () {
            var string = 'food;cars; games';
            var expected = ['food', 'cars', 'games'];
            expect($$.split(string, ';')).to.eql(expected);
        });
    });
});
