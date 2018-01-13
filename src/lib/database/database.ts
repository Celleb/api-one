/**
 * Database Module
 * @module lib/database
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { DatabaseConfig, Inject } from '../../core';
import { Connection } from './connection';
import * as mongoose from 'mongoose';
import * as debug from 'debug';

export default class Database {
    private static connection: mongoose.Connection;
    private constructor(config: DatabaseConfig) {
        Database.connection = (new Connection(config)).connect();
        this.listen();
    }

    private listen() {
        Database.connection.on('connect', function () {
            debug('database connected');
        });

        Database.connection.on('disconnect', function () {
            debug('database disconnected');
        });
    }

    static getConnection(config: DatabaseConfig): mongoose.Connection {
        if (!Database.connection) {
            (new Database(config));
        }
        return Database.connection;
    }
}

