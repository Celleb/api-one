"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const connection_helper_1 = require("./connection-helper");
const mongoose = require("mongoose");
const debug = require("debug");
class Database extends mongoose.Connection {
    constructor(base, config) {
        super(base);
        const helper = new connection_helper_1.ConnectionHelper(config);
        this.open(helper.uri, config.name, config.port, helper.options);
    }
    listen() {
        this.on('connect', function () {
            debug('database connected');
        });
        this.on('disconnect', function () {
            debug('database disconnected');
        });
    }
    static connect(base, config) {
        if (!Database.connection) {
            config = config ? config : core_1.DI.inject('DatabaseConfig');
            base = base ? base : (new mongoose.Mongoose());
            Database.connection = (new Database(base, config));
        }
        return Database.connection;
    }
}
exports.Database = Database;
