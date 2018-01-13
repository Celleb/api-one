"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const debug = require("debug");
class Database {
    constructor(config) {
        Database.connection = (new connection_1.Connection(config)).connect();
        this.listen();
    }
    listen() {
        Database.connection.on('connect', function () {
            debug('database connected');
        });
        Database.connection.on('disconnect', function () {
            debug('database disconnected');
        });
    }
    static getConnection(config) {
        if (!Database.connection) {
            (new Database(config));
        }
        return Database.connection;
    }
}
exports.default = Database;
