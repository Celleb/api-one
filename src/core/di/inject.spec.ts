'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import 'reflect-metadata';
const DI = require('../dist/core/di').DI;
const Inject = require('../dist/core/di/inject').Inject;

const expect = chai.expect;


describe('Inject decorator', function () {
    const log = sinon.spy(function (message: string) {
        return true;
    });
    class Logger {
        info(message: string) {
            return log(message);
        }
    }
    DI.register(Logger);

    it('should throw an error when trying to inject an unregistered dependency into the constructor', function () {

        DI.register(Logger);
        @Inject()
        class Car {
            constructor(public logger: Logger, public fork: Farm) { }
        }

        expect(() => {
            const car = new Car(undefined, undefined);
        }).to.throw(ReferenceError, 'Dependency does not exist.');

    });
    it('should throw an error when trying to inject an unregistered dependency into a property', function () {
        expect(() => {
            class Car {
                @Inject()
                log: Fodder;
            }
        }).to.throw(ReferenceError, 'Dependency does not exist.');
    });
    it('should inject a dependencies into a property', function () {
        class Car {
            @Inject()
            log: Logger;
        }
        const car = new Car();
        expect(car.log).to.be.an.instanceof(Logger);
        car.log.info('Holla');
        expect(log.calledOnce).to.be.ok;
    });
    it('should inject dependencies into a constructor', function () {
        class Fork { }
        DI.register(Logger);
        DI.register(Fork);
        @Inject()
        class Car {
            constructor(public logger: Logger, public fork: Fork) { }
        }
        const car = new Car(undefined, undefined);
        expect(car.logger).to.be.an.instanceof(Logger);
        expect(car.fork).to.be.an.instanceOf(Fork);
        car.logger.info('Holla');
        expect(log.called).to.be.ok;
    });
});
