"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassUtil {
    static getClassName(item) {
        let name;
        try {
            name = item.prototype.constructor.name;
        }
        catch (e) {
            name = item.prototype.constructor.toString().match(/\w+/g)[1];
        }
        return name;
    }
}
exports.ClassUtil = ClassUtil;
