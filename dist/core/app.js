"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var _1 = require("./");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var helmet = require("helmet");
var compression = require("compression");
var csurf = require("csurf");
var App = (function () {
    function App(config) {
        this.config = config;
        this.application = express();
    }
    App.prototype.use = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.application).use.apply(_a, args);
        return this;
        var _a;
    };
    App.prototype.rootware = function () {
        this.config.rootware.helmet && this.use(helmet());
        this.config.rootware.methodOverride && this.use(methodOverride());
        this.config.rootware.bodyParser && this.use(bodyParser.urlencoded({
            extended: true
        })).use(bodyParser.json());
        this.config.rootware.csurf && this.use(csurf());
        this.config.rootware.compression && this.use(compression());
    };
    Object.defineProperty(App.prototype, "app", {
        get: function () {
            return this.application;
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.register = function (provider) {
        _1.DI.register(provider);
        return this;
    };
    return App;
}());
exports.App = App;
