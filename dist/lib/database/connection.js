"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const default_options_1 = require("./default-options");
class Connection {
    constructor(config) {
        this.config = config;
        this.setUri();
        this.setOptions();
    }
    setUri() {
        this.uri = this.config.uri || this.makeUri();
    }
    makeUri() {
        if (!this.config.host) {
            return null;
        }
        let uri = 'mongodb://';
        uri += this.config.host + ':';
        uri += this.config.port || 27017;
        uri += this.config.replicaSet ? ',' + this.config.replicaSet.hosts.join(',') : '';
        uri += '/' + this.config.name;
        uri += '?' + this.config.queryOptions || '';
        return uri;
    }
    setOptions() {
        this.options = Object.assign({}, default_options_1.defaultOptions, this.config.options);
        this.setAuth();
        this.setReplicaSet();
    }
    setAuth() {
        if (this.config.password && this.config.username) {
            this.options.user = this.config.username;
            this.options.pass = this.config.password;
            this.options.authSource = this.config.authSource || 'admin';
        }
    }
    setReplicaSet() {
        if (this.config.replicaSet && this.config.replicaSet.name) {
            this.options.replicaSet = this.config.replicaSet.name;
        }
    }
    connect() {
        return (new mongoose.Mongoose()).createConnection(this.uri, this.options);
    }
}
exports.Connection = Connection;
