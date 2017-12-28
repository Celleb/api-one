declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
const ClassUtil = require('../dist/lib/utils/class.util').ClassUtil;
const expect = chai.expect;

class Car {
    constructor(private options: any) {
        this.options = [4, 6];
    }
}
describe('ClassUtil', function () {
    describe('ClassUtil#getClassName', function () {
        it('should return the name of the class or object', function () {
            expect(ClassUtil.getClassName(Car)).to.equal('Car');
        });
    });
});
