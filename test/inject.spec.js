'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
var chai = require("chai");
var sinon = require("sinon");
require("reflect-metadata");
var DI = require('../dist/core/di').DI;
var Inject = require('../dist/core/di/inject').Inject;
var expect = chai.expect;
describe('Inject decorator', function () {
    var log = sinon.spy(function (message) {
        return true;
    });
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.prototype.info = function (message) {
            return log(message);
        };
        return Logger;
    }());
    DI.register(Logger);
    it('should throw an error when trying to inject an unregistered dependency into the constructor', function () {
        DI.register(Logger);
        var Car = /** @class */ (function () {
            function Car(logger, fork) {
                this.logger = logger;
                this.fork = fork;
            }
            Car = __decorate([
                Inject(),
                __metadata("design:paramtypes", [Logger, Object])
            ], Car);
            return Car;
        }());
        expect(function () {
            var car = new Car(undefined, undefined);
        }).to["throw"](ReferenceError, 'Dependency does not exist.');
    });
    it('should throw an error when trying to inject an unregistered dependency into a property', function () {
        expect(function () {
            var Car = /** @class */ (function () {
                function Car() {
                }
                __decorate([
                    Inject(),
                    __metadata("design:type", Object)
                ], Car.prototype, "log");
                return Car;
            }());
        }).to["throw"](ReferenceError, 'Dependency does not exist.');
    });
    it('should inject a dependencies into a property', function () {
        var Car = /** @class */ (function () {
            function Car() {
            }
            __decorate([
                Inject(),
                __metadata("design:type", Logger)
            ], Car.prototype, "log");
            return Car;
        }());
        var car = new Car();
        expect(car.log).to.be.an["instanceof"](Logger);
        car.log.info('Holla');
        expect(log.calledOnce).to.be.ok;
    });
    it('should inject dependencies into a constructor', function () {
        var Fork = /** @class */ (function () {
            function Fork() {
            }
            return Fork;
        }());
        DI.register(Logger);
        DI.register(Fork);
        var Car = /** @class */ (function () {
            function Car(logger, fork) {
                this.logger = logger;
                this.fork = fork;
            }
            Car = __decorate([
                Inject(),
                __metadata("design:paramtypes", [Logger, Fork])
            ], Car);
            return Car;
        }());
        var car = new Car(undefined, undefined);
        expect(car.logger).to.be.an["instanceof"](Logger);
        expect(car.fork).to.be.an.instanceOf(Fork);
        car.logger.info('Holla');
        expect(log.called).to.be.ok;
    });
});
