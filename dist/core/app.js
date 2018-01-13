"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const _1 = require("./");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const helmet = require("helmet");
const compression = require("compression");
const csurf = require("csurf");
const morgan = require("morgan");
const debug = require("debug");
debug('api-one');
class App {
    constructor(config) {
        this.config = config;
        this.application = express();
    }
    use(...args) {
        this.application.use(...args);
        return this;
    }
    rootware() {
        this.config.rootware.helmet && this.use(helmet());
        this.config.rootware.methodOverride && this.use(methodOverride());
        this.config.rootware.bodyParser && this.use(bodyParser.urlencoded({
            extended: true
        })).use(bodyParser.json());
        this.config.rootware.csurf && this.use(csurf());
        this.config.rootware.compression && this.use(compression());
        this.config.rootware.morgan && this.use(morgan('combined'));
    }
    get app() {
        return this.application;
    }
    register(provider) {
        _1.DI.register(provider);
        return this;
    }
    addRoutes(routes) {
    }
    createRoutes(routes) {
        return this;
    }
    defaultProviders() {
        return this;
    }
}
exports.App = App;
