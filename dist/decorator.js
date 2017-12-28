"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
require("reflect-metadata");
function Injector() {
    return function (constructor) {
        return (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = this;
                console.log(args);
                args = [new Car(), new Engine()];
                _this = _super.apply(this, args) || this;
                return _this;
            }
            return class_1;
        }(constructor));
    };
}
exports.Injector = Injector;
var Car = (function () {
    function Car(value) {
        if (value === void 0) { value = 2; }
        this.value = value;
    }
    return Car;
}());
exports.Car = Car;
var Engine = (function () {
    function Engine(capacity) {
        if (capacity === void 0) { capacity = 4; }
        this.capacity = capacity;
    }
    return Engine;
}());
exports.Engine = Engine;
function Inject() {
    return function (target, key) {
        console.log(key);
        console.log(Reflect.getOwnMetadataKeys(target, key));
        console.log(Reflect.getOwnMetadata('design:type', target, key).name);
    };
}
exports.Inject = Inject;
var Fifa = (function () {
    function Fifa(car, engine) {
        this.car = car;
        this.engine = engine;
        this.fail = 'fool';
        console.log(this.car);
        console.log(this.engine);
    }
    __decorate([
        Inject(),
        __metadata("design:type", String)
    ], Fifa.prototype, "fail", void 0);
    Fifa = __decorate([
        Injector(),
        __metadata("design:paramtypes", [Car, Engine])
    ], Fifa);
    return Fifa;
}());
exports.Fifa = Fifa;
