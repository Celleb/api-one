/**
 * connection.spec.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var ConnectionHelper = require('../dist/lib/database/connection-helper').ConnectionHelper;
var defaultOptions = require('../dist/lib/database/default-options').defaultOptions;
var expect = chai.expect;
describe('Connection', function () {
    it('have a uri property', function () {
        var connection = new ConnectionHelper({});
        expect(connection).to.haveOwnProperty('uri').to.eql(null);
    });
    it('should have uri set to the uri value from the config parameter', function () {
        var config = {
            name: 'DBName',
            uri: 'mongodb://localhost:27017/DBName'
        };
        var connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(config.uri);
    });
    it('should construct the uri from the given config values', function () {
        var config = {
            name: 'DBName',
            host: 'localhost',
            port: 27017,
            queryOptions: 'authSource=admin'
        };
        var expected = 'mongodb://' + config.host + ':' + config.port + '/' + config.name + '?' + config.queryOptions;
        var connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
    });
    it('should construct the uri from the given config values with replicaSet', function () {
        var config = {
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
        var replicaSet = ',localhost2:27017,localhost3:27017';
        var expected = 'mongodb://' + config.host + ':' + config.port + replicaSet + '/'
            + config.name + '?' + config.queryOptions;
        var connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
    });
    it('should set the default options and override them with options in the config', function () {
        var config = {
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
        var options = defaultOptions;
        options.user = config.username;
        options.pass = config.password;
        options.authSource = config.authSource;
        options.replicaSet = config.replicaSet.name;
        var replicaSet = ',localhost2:27017,localhost3:27017';
        var expected = 'mongodb://' + config.host + ':' + config.port + replicaSet + '/'
            + config.name + '?' + config.queryOptions;
        var connection = new ConnectionHelper(config);
        expect(connection.uri).to.eql(expected);
        expect(connection.options).to.eql(options);
    });
});
