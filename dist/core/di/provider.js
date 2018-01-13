"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
require("reflect-metadata");
function Provider(options) {
    return function (target) {
        target = _1.newClass(target);
        if (options && options.multi === true) {
            Reflect.defineMetadata('multi', true, target);
        }
        return target;
    };
}
exports.Provider = Provider;
