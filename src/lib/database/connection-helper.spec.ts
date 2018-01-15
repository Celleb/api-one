/**
 * connection.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const ConnectionHelper = require('../dist/lib/database/connection-helper').ConnectionHelper;
const defaultOptions = require('../dist/lib/database/default-options').defaultOptions;


const expect = chai.expect;

describe('Connection', function () {

    it('have a uri property', function () {
        const connection = new ConnectionHelper({});
        expect(connection).to.haveOwnProperty('uri').to.eql(null);
    });
    it('should have uri set to the uri value from the config parameter', function () {
        const config = {
            name: 'DBName',
            uri: 'mongodb://localhost:27017/DBName'
        };
        const connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(config.uri);
    });

    it('should construct the uri from the given config values', function () {
        const config = {
            name: 'DBName',
            host: 'localhost',
            port: 27017,
            queryOptions: 'authSource=admin'
        };
        const expected = 'mongodb://' + config.host + ':' + config.port + '/' + config.name + '?' + config.queryOptions;
        const connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
    });

    it('should construct the uri from the given config values with replicaSet', function () {
        const config = {
            name: 'DBName',
            host: 'localhost',
            port: 27017,
            queryOptions: 'authSource=admin',
            replicaSet: {
                name: 'setName',
                hosts: [
                    'localhost2:27017',
                    'localhost3:27017'
                ]
            }
        };
        const replicaSet = ',localhost2:27017,localhost3:27017';
        const expected = 'mongodb://' + config.host + ':' + config.port + replicaSet + '/'
            + config.name + '?' + config.queryOptions;
        const connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
    });

    it('should set the default options and override them with options in the config', function () {
        const config = {
            name: 'DBName',
            host: 'localhost',
            port: 27017,
            username: 'username',
            password: 'password',
            queryOptions: 'authSource=admin',
            authSource: 'source',
            replicaSet: {
                name: 'setName',
                hosts: [
                    'localhost2:27017',
                    'localhost3:27017'
                ]
            }
        };
        const options = defaultOptions;
        options.user = config.username;
        options.pass = config.password;
        options.authSource = config.authSource;
        options.replicaSet = config.replicaSet.name;
        const replicaSet = ',localhost2:27017,localhost3:27017';
        const expected = 'mongodb://' + config.host + ':' + config.port + replicaSet + '/'
            + config.name + '?' + config.queryOptions;
        const connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
        expect(connection.options).to.eql(options);
    });
});
