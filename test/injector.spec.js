'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var sinon = require("sinon");
require("reflect-metadata");
var Injector = require('../dist/core/di/injector').Injector;
var expect = chai.expect;
var Car = /** @class */ (function () {
    function Car(options) {
        this.options = options;
        this.options = [4, 6];
    }
    return Car;
}());
var Engine = /** @class */ (function () {
    function Engine(options) {
        this.options = options;
        this.capacity = 5;
    }
    return Engine;
}());
describe('Injector', function () {
    var injector = new Injector();
    it('should have a `singletons` property', function () {
        expect(injector).to.haveOwnProperty('singletons');
        expect(injector.singletons).to.be.an('object').to.be.empty;
    });
    it('should have a property called `factories`', function () {
        expect(injector).to.haveOwnProperty('factories');
        expect(injector.factories).to.be.an('object').to.be.empty;
    });
    describe('Injector.register', function () {
        beforeEach(function () {
            injector = new Injector();
        });
        it('should register a singleton injectable when provided with a class', function () {
            injector.register(Car);
            expect(injector.singletons).to.have.ownProperty('Car');
            expect(injector.singletons.Car).to.be.an.instanceOf(Car);
            expect(injector.factories).to.have.ownProperty('Car');
            expect(injector.factories.Car).to.be.a('function');
        });
        it('should register multiple singletons when provided with an array of classes', function () {
            injector.register([Car, Engine]);
            expect(injector.singletons).to.have.ownProperty('Car');
            expect(injector.singletons).to.have.ownProperty('Engine');
        });
        it('should register a provider given a provider object with useClass', function () {
            injector.register({ provide: Car, useClass: Engine });
            expect(injector.singletons).to.have.ownProperty('Car');
            expect(injector.singletons.Car).to.be.an.instanceOf(Engine);
        });
        it('should register a provider given a provider object with useClass and provide string', function () {
            injector.register({ provide: 'Engine', useClass: Car });
            expect(injector.singletons).to.have.ownProperty('Engine');
            expect(injector.singletons.Engine).to.be.an.instanceOf(Car);
        });
        it('should register multiple providers given an array of provider objects', function () {
            injector.register([{ provide: 'Engine', useClass: Car }, { provide: Car, useClass: Engine }]);
            expect(injector.singletons).to.have.ownProperty('Engine');
            expect(injector.singletons.Engine).to.be.an.instanceOf(Car);
            expect(injector.singletons).to.haveOwnProperty('Car');
            expect(injector.singletons.Car).to.be.an.instanceOf(Engine);
        });
        it('should register a provider given a provider object with useValue', function () {
            var value = {
                foo: 'bar',
                bar: 'foo'
            };
            injector.register({ provide: 'Config', useValue: value });
            expect(injector.singletons).to.haveOwnProperty('Config');
            expect(injector.singletons.Config).to.eql(value);
        });
        it('should thrown an exception when using a useValue provider with a not string provide value.', function () {
            var value = {
                foo: 'bar',
                bar: 'foo'
            };
            expect(function () {
                injector.register({ provide: Car, useValue: value });
            }).to.throw(TypeError, '`provide` must be a string when providing a value.');
        });
        it('should throw an error if provided with an invalid factory', function () {
            expect(function () { return injector.register('factory'); }).to.throw(TypeError);
            expect(function () { return injector.register(['']); }).to.throw(TypeError);
        });
        it('should register a provider given a provider object with useFactory', function () {
            var factory = sinon.spy(function () {
                return new Car();
            });
            injector.register({ provide: Car, useFactory: factory });
            expect(injector.singletons).to.haveOwnProperty('Car');
            expect(injector.singletons.Car).to.be.an.instanceOf(Car);
            expect(factory.calledOnce).to.be.ok;
        });
        it('should register a multi instance provider when given a provider object with multi set to true.', function () {
            injector.register({ provide: Car, useClass: Car, multi: true });
            expect(injector.singletons).to.not.haveOwnProperty('Car');
            expect(injector.factories).to.haveOwnProperty('Car');
            expect(injector.factories.Car).to.be.a('function');
        });
        it('should register a multi instance provider given a provider with multi meta data set to true.', function () {
            Reflect.defineMetadata('multi', true, Car);
            injector.register({ provide: Car, useClass: Car });
            expect(injector.singletons).to.not.haveOwnProperty('Car');
            expect(injector.factories).to.haveOwnProperty('Car');
            expect(injector.factories.Car).to.be.a('function');
        });
        it('should throw an exception given a provider object with useFactory and an invalid factory', function () {
            expect(function () {
                injector.register({ provide: Car, useFactory: 'string' });
            }).to.throw(TypeError, 'Invalid factory, a factory must be a function.');
        });
    });
    describe('Injector.inject', function () {
        beforeEach(function () {
            beforeEach(function () {
                injector = new Injector();
            });
        });
        it('should return the provider when `inject` is called with a class parameter', function () {
            injector.register(Car);
            expect(injector.inject(Car)).to.be.an.instanceof(Car);
        });
        it('should return a value provider when requested for one', function () {
            var value = {
                foo: 'bar',
                bar: 'foo'
            };
            injector.register({ provide: 'Config', useValue: value });
            expect(injector.inject('Config')).to.eql(value);
        });
        it('should return the provider when `inject` is called with a string parameter', function () {
            injector.register(Car);
            expect(injector.inject('Car')).to.be.an.instanceof(Car);
        });
        it('should call the factory and return the provider when requesting a multi instance provider with a factory.', function () {
            var factory = sinon.spy(function () {
                return new Car();
            });
            injector.register({ provide: Car, useFactory: factory, multi: true });
            var car = injector.inject('Car');
            var car2 = injector.inject('Car');
            expect(car).to.be.an.instanceof(Car);
            expect(car2).to.be.an.instanceOf(Car);
            car.options = 4;
            expect(car).to.not.eql(car2);
            expect(factory.called).to.be.ok;
        });
        it('should return a ReferenceError for unregistered injectables', function () {
            expect(function () {
                injector.inject('engine');
            }).to.throw(ReferenceError, 'Dependency does not exist.');
        });
    });
    describe('Injector.get', function () {
        beforeEach(function () {
            beforeEach(function () {
                injector = new Injector();
            });
        });
        it('should return the provider when `get` is called with a class parameter', function () {
            injector.register(Car);
            expect(injector.get(Car)).to.be.an.instanceof(Car);
        });
        it('should return a value provider when requested for one', function () {
            var value = {
                foo: 'bar',
                bar: 'foo'
            };
            injector.register({ provide: 'Config', useValue: value });
            expect(injector.get('Config')).to.eql(value);
        });
        it('should return the provider when `get` is called with a string parameter', function () {
            injector.register(Car);
            expect(injector.get('Car')).to.be.an.instanceof(Car);
        });
        it('should call the factory and return the provider when requesting a multi instance provider with a factory.', function () {
            var factory = sinon.spy(function (inject) {
                return new Car();
            });
            injector.register({ provide: Car, useFactory: factory, multi: true });
            expect(injector.get('Car')).to.be.an.instanceof(Car);
            expect(factory.calledWith(injector)).to.be.ok;
        });
        it('should return a ReferenceError for unregistered providers', function () {
            expect(function () {
                injector.get('engine');
            }).to.throw(ReferenceError, 'Dependency does not exist.');
        });
    });
    describe('Injector.clear', function () {
        it('should remove all providers when Injector.clear() is called', function () {
            injector.register(Car);
            injector.clear();
            expect(injector.singletons).to.be.empty;
            expect(injector.factories).to.be.empty;
            expect(function () { return injector.inject(Car); }).to.throw(ReferenceError, 'Dependency does not exist.');
        });
    });
});
