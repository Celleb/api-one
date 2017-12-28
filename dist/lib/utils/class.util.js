"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClassUtil = (function () {
    function ClassUtil() {
    }
    ClassUtil.getClassName = function (item) {
        var name;
        try {
            name = item.prototype.constructor.name;
        }
        catch (e) {
            name = item.prototype.constructor.toString().match(/\w+/g)[1];
        }
        return name;
    };
    return ClassUtil;
}());
exports.ClassUtil = ClassUtil;
