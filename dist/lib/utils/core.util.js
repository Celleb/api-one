"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoreUtilities {
    static isObject(object) {
        return object === Object(object);
    }
    static isRealObject(object) {
        return Array.isArray(object) ? false : this.isObject(object);
    }
}
exports.CoreUtilities = CoreUtilities;
exports.$$ = CoreUtilities;
