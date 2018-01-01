"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
__export(require("./injector"));
__export(require("./provider"));
__export(require("./inject"));
exports.DI = new _1.Injector();
