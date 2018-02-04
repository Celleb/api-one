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
import { DI } from 'tsjs-di';

export class Database extends mongoose.Connection {
    /**
     * Database singleton instance
     */
    private static connection: mongoose.Connection;
    private constructor(base: mongoose.Mongoose, config: DatabaseConfig) {
        super(base);
        const helper = new ConnectionHelper(config);
        this.open(helper.uri, config.name, config.port, helper.options);
    }

    private listen() {
        this.on('connect', function () {
            debug('database connected');
        });

        this.on('disconnect', function () {
            debug('database disconnected');
        });
    }

    static connect(base?: mongoose.Mongoose, config?: DatabaseConfig): mongoose.Connection {
        if (!Database.connection) {
            config = config ? config : DI.inject('DatabaseConfig');
            base = base ? base : (new mongoose.Mongoose());
            Database.connection = (new Database(base, config));
        }
        return Database.connection;
    }
}

