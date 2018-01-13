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
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Provider = require('../dist/core/di/provider').Provider;
var DI = require('../dist/core/di').DI;
require("reflect-metadata");
var expect = chai.expect;
describe('Provider decorator `@Provider()`', function () {
    it('a class should have metadata called `multi` when decorated with Provider and multi set to true', function () {
        var Car = /** @class */ (function () {
            function Car() {
            }
            Car = __decorate([
                Provider({ multi: true })
            ], Car);
            return Car;
        }());
        expect(Reflect.getOwnMetadata('multi', Car)).to.be.ok;
    });
    it('should be able able to have its dependencies injected', function () {
        DI.clear();
        var Logger = /** @class */ (function () {
            function Logger() {
            }
            return Logger;
        }());
        DI.register({ provide: 'Logger', useValue: 'car' });
        var Fan = /** @class */ (function () {
            function Fan(logger) {
                this.logger = logger;
            }
            Fan = __decorate([
                Provider(),
                __metadata("design:paramtypes", [Logger])
            ], Fan);
            return Fan;
        }());
        var fan = new Fan(undefined);
        expect(fan.logger).to.eql('car');
    });
});
