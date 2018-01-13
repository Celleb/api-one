/**
 * connection.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DatabaseConfig } from '../../core';
import * as mongoose from 'mongoose';
import { defaultOptions } from './default-options';
import * as debug from 'debug';


export class Connection {
    private options: mongoose.ConnectionOptions;
    /**
     * Mongodb connection uri string
     */
    uri: string;
    constructor(private config: DatabaseConfig) {
        this.setUri();
        this.setOptions();
    }

    /**
     * Sets the mongodb connection uri string
     */
    private setUri(): void {
        this.uri = this.config.uri || this.makeUri();
    }

    /**
     * Creates a uri connection string from the config
     * @returns Returns a mongodb connection uri
     */
    private makeUri(): string {
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

    /**
     * Sets the mongoose connection options by copying and overriding the default options
     */
    private setOptions(): void {
        this.options = (<any>Object).assign({}, defaultOptions, this.config.options);
        this.setAuth();
        this.setReplicaSet();
    }

    /**
     * Sets the mongodb authentication options if provided
     */
    private setAuth(): void {
        if (this.config.password && this.config.username) {
            this.options.user = this.config.username;
            this.options.pass = this.config.password;
            this.options.authSource = this.config.authSource || 'admin';
        }
    }

    private setReplicaSet(): void {
        if (this.config.replicaSet && this.config.replicaSet.name) {
            this.options.replicaSet = this.config.replicaSet.name;
        }
    }

    /**
     * Creates and returns a mongoose connection
     * @returns mongoose connection
     */
    connect(): mongoose.Connection {
        return (new mongoose.Mongoose()).createConnection(this.uri, this.options);
    }
}
