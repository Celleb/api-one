"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
require("reflect-metadata");
function Inject() {
    return function (target, key) {
        if (key) {
            const name = Reflect.getOwnMetadata('design:type', target, key).name;
            const dependency = _1.DI.inject(name);
            target[key] = dependency;
            return;
        }
        return newClass(target);
    };
}
exports.Inject = Inject;
function newClass(target) {
    return class extends target {
        constructor(...args) {
            const params = Reflect.getOwnMetadata('design:paramtypes', target);
            if (params) {
                for (let i in params) {
                    if (args[i] !== undefined) {
                        return;
                    }
                    const type = params[i].name;
                    const dependency = _1.DI.inject(type);
                    args[i] = dependency;
                }
            }
            super(...args);
        }
    };
}
exports.newClass = newClass;
