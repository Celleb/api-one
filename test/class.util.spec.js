"use strict";
exports.__esModule = true;
var chai = require("chai");
var ClassUtil = require('../dist/lib/utils/class.util').ClassUtil;
var expect = chai.expect;
var Car = /** @class */ (function () {
    function Car(options) {
        this.options = options;
        this.options = [4, 6];
    }
    return Car;
}());
describe('ClassUtil', function () {
    describe('ClassUtil#getClassName', function () {
        it('should return the name of the class or object', function () {
            expect(ClassUtil.getClassName(Car)).to.equal('Car');
        });
    });
});
