'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Injector {
    constructor(config) {
        this.config = config;
        this.singletons = {};
        this.factories = {};
    }
    register(providers) {
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
    }
    isConstructor(provider) {
        if (provider.provide) {
            return !!(typeof provider.provide === 'function' && provider.provide.prototype && provider.provide.prototype.constructor);
        }
        return !!(typeof provider === 'function' && provider.prototype && provider.prototype.constructor);
    }
    registerMultiple(providers) {
        for (let provider of providers) {
            this.register(provider);
        }
    }
    registerSingleton(provider, name) {
        name = name ? name : provider.prototype.constructor.name;
        this.singletons[name] = this.factory(provider);
        this.factories[name] = this.factory.bind(this, provider);
        return;
    }
    registerSingletonFactory(factory, name) {
        this.singletons[name] = factory(this);
        this.factories[name] = factory;
        return;
    }
    registerMultiInstance(name, factory) {
        this.factories[name] = factory;
        return;
    }
    useClass(provider) {
        const name = this.getName(provider);
        return (provider.multi || this.isMulti(provider.useClass)) ? this.registerMultiInstance(name, this.factory.bind(this, provider.useClass))
            : this.registerSingleton(provider.useClass, name);
    }
    useValue(provider) {
        if (typeof provider.provide !== 'string') {
            throw new TypeError('`provide` must be a string when providing a value.');
        }
        return provider.multi ? this.registerMultiInstance(name, this.factory.bind(this, provider.useValue))
            : this.registerSingleton(provider.useValue, provider.provide);
    }
    useFactory(provider) {
        if (typeof provider.useFactory !== 'function') {
            throw new TypeError('Invalid factory, a factory must be a function.');
        }
        const name = this.getName(provider);
        return provider.multi ? this.registerMultiInstance(name, provider.useFactory)
            : this.registerSingletonFactory(provider.useFactory, name);
    }
    isMulti(provider) {
        return !!Reflect.getOwnMetadata('multi', provider);
    }
    getName(provider) {
        return (typeof provider.provide === 'string') ? provider.provide : provider.provide.prototype.constructor.name;
    }
    getKey(key) {
        return (typeof key === 'string') ? key : key.prototype.constructor.name;
    }
    factory(provider) {
        if (this.isConstructor(provider) && provider.prototype.constructor) {
            return new provider();
        }
        return provider;
    }
    get(key) {
        const name = this.getKey(key);
        if (!this.factories.hasOwnProperty(name)) {
            throw ReferenceError('Dependency does not exist.');
        }
        return this.factories[name](this);
    }
    inject(key) {
        const name = this.getKey(key);
        if (this.singletons.hasOwnProperty(name)) {
            return this.singletons[name];
        }
        else if (this.factories.hasOwnProperty(name)) {
            return this.get(name);
        }
        throw new ReferenceError('Dependency does not exist.');
    }
    clear() {
        this.singletons = {};
        this.factories = {};
    }
}
exports.Injector = Injector;
