import 'reflect-metadata';

export function Injector() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T): T {
        // console.log(Reflect.getOwnMetadataKeys(constructor.prototype.constructor));
        //console.log(Reflect.getOwnMetadata('design:paramtypes', constructor)[0].name);
        //console.log(constructor.prototype.constructor.name);

        // console.log(typeof constructor);
        return class extends constructor {
            constructor(...args: any[]) {
                console.log(args);
                args = [new Car(), new Engine()];
                super(...args);
            }
        }
    }
}

export class Car {
    constructor(private value = 2) {

    }
}

export class Engine {
    constructor(protected capacity = 4) {
    }
}

export function Inject() {
    return function (target: any, key: string) {
        console.log(key);
        console.log(Reflect.getOwnMetadataKeys(target, key));
        console.log(Reflect.getOwnMetadata('design:type', target, key).name);
    };
}

@Injector()
export class Fifa {
    @Inject()
    private fail: string = 'fool';
    constructor(private car: Car, private engine: Engine) {
        console.log(this.car);
        console.log(this.engine);
    }
}
