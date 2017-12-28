'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Injector = (function () {
    function Injector(config) {
        this.config = config;
        this.singletons = {};
        this.factories = {};
    }
    Injector.prototype.register = function (providers) {
        if (Array.isArray(providers)) {
            return this.registerMultiple(providers);
        }
        if (typeof providers === 'object' && providers.provide) {
            if (!(typeof providers.provide === 'string' || this.isConstructor(providers))) {
                throw new TypeError('`Provider.provide` must be a string or a Class');
            }
            if (providers.useClass) {
                return this.useClass(providers);
            }
            else if (providers.useValue) {
                return this.useValue(providers);
            }
            else if (providers.useFactory) {
                return this.useFactory(providers);
            }
        }
        if (this.isConstructor(providers)) {
            return this.registerSingleton(providers);
        }
        throw new TypeError('Invalid provider(s)');
    };
    Injector.prototype.isConstructor = function (provider) {
        if (provider.provide) {
            return !!(typeof provider.provide === 'function' && provider.provide.prototype && provider.provide.prototype.constructor);
        }
        return !!(typeof provider === 'function' && provider.prototype && provider.prototype.constructor);
    };
    Injector.prototype.registerMultiple = function (providers) {
        for (var _i = 0, providers_1 = providers; _i < providers_1.length; _i++) {
            var provider = providers_1[_i];
            this.register(provider);
        }
    };
    Injector.prototype.registerSingleton = function (provider, name) {
        name = name ? name : provider.prototype.constructor.name;
        this.singletons[name] = this.factory(provider);
        this.factories[name] = this.factory.bind(this, provider);
        return;
    };
    Injector.prototype.registerSingletonFactory = function (factory, name) {
        this.singletons[name] = factory(this);
        this.factories[name] = factory;
        return;
    };
    Injector.prototype.registerMultiInstance = function (name, factory) {
        this.factories[name] = factory;
        return;
    };
    Injector.prototype.useClass = function (provider) {
        var name = this.getName(provider);
        return (provider.multi || this.isMulti(provider.useClass)) ? this.registerMultiInstance(name, this.factory.bind(this, provider.useClass))
            : this.registerSingleton(provider.useClass, name);
    };
    Injector.prototype.useValue = function (provider) {
        if (typeof provider.provide !== 'string') {
            throw new TypeError('`provide` must be a string when providing a value.');
        }
        return provider.multi ? this.registerMultiInstance(name, this.factory.bind(this, provider.useValue))
            : this.registerSingleton(provider.useValue, provider.provide);
    };
    Injector.prototype.useFactory = function (provider) {
        if (typeof provider.useFactory !== 'function') {
            throw new TypeError('Invalid factory, a factory must be a function.');
        }
        var name = this.getName(provider);
        return provider.multi ? this.registerMultiInstance(name, provider.useFactory)
            : this.registerSingletonFactory(provider.useFactory, name);
    };
    Injector.prototype.isMulti = function (provider) {
        return !!Reflect.getOwnMetadata('multi', provider);
    };
    Injector.prototype.getName = function (provider) {
        return (typeof provider.provide === 'string') ? provider.provide : provider.provide.prototype.constructor.name;
    };
    Injector.prototype.getKey = function (key) {
        return (typeof key === 'string') ? key : key.prototype.constructor.name;
    };
    Injector.prototype.factory = function (provider) {
        if (this.isConstructor(provider) && provider.prototype.constructor) {
            return new provider();
        }
        return provider;
    };
    Injector.prototype.get = function (key) {
        var name = this.getKey(key);
        if (!this.factories.hasOwnProperty(name)) {
            throw ReferenceError('Dependency does not exist.');
        }
        return this.factories[name](this);
    };
    Injector.prototype.inject = function (key) {
        var name = this.getKey(key);
        if (this.singletons.hasOwnProperty(name)) {
            return this.singletons[name];
        }
        else if (this.factories.hasOwnProperty(name)) {
            return this.get(name);
        }
        throw new ReferenceError('Dependency does not exist.');
    };
    return Injector;
}());
exports.Injector = Injector;
