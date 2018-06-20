/**
 * Database Module
 * @module lib/database
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DatabaseConfig } from '../../core';
import { ConnectionHelper } from './connection-helper';
import * as mongoose from 'mongoose';
import * as debug from 'debug';

export class Database {
    /**
     * Database singleton instance
     */
    private static connection: mongoose.Connection;
    private constructor(config: DatabaseConfig) {
        const helper = new ConnectionHelper(config);
        Database.connection = mongoose.createConnection(helper.uri, helper.options);
    }

    private listen() {
        Database.connection.on('connect', function () {
            debug('database connected');
        });

        Database.connection.on('disconnect', function () {
            debug('database disconnected');
        });
    }

    static connect(config: DatabaseConfig): mongoose.Connection {
        if (!Database.connection) {
            config = config;
            (new this(config));
        }
        return Database.connection;
    }
}

