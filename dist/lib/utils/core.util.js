"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoreUtilities {
    static isObject(item) {
        return item === Object(item);
    }
    static isRealObject(item) {
        return Array.isArray(item) ? false : this.isObject(item);
    }
    static strToBool(value) {
        if (value === true || value === false) {
            return value;
        }
        if (this.trueValues.indexOf(value) !== -1) {
            return true;
        }
        if (this.falseValues.indexOf(value) !== -1) {
            return false;
        }
        return null;
    }
}
CoreUtilities.falseValues = ['no', 'false'];
CoreUtilities.trueValues = ['yes', 'true'];
exports.CoreUtilities = CoreUtilities;
exports.$$ = CoreUtilities;