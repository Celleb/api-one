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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
require("reflect-metadata");
function Inject() {
    return function (target, key) {
        if (key) {
            var name_1 = Reflect.getOwnMetadata('design:type', target, key).name;
            var dependency = _1.DI.inject(name_1);
            target[key] = dependency;
            return;
        }
        return newClass(target);
    };
}
exports.Inject = Inject;
function newClass(target) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = this;
            var params = Reflect.getOwnMetadata('design:paramtypes', target);
            if (params) {
                for (var i in params) {
                    if (args[i] !== undefined) {
                        return;
                    }
                    var type = params[i].name;
                    var dependency = _1.DI.inject(type);
                    args[i] = dependency;
                }
            }
            _this = _super.apply(this, args) || this;
            return _this;
        }
        return class_1;
    }(target));
}
exports.newClass = newClass;
