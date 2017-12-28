import { Constructor } from '../';
import { DI } from './';

import 'reflect-metadata';

export function Inject() {
    return function (target: Constructor, key?: string): any {
        if (key) {
            const name = Reflect.getOwnMetadata('design:type', target, key).name;
            const dependency = DI.inject(name);
            target[key] = dependency;
            return;
        }
        return class extends target {
            constructor(...args: any[]) {
                const params = Reflect.getOwnMetadata('design:paramtypes', target);
                if (params) {
                    for (let i in params) {
                        if (args[i] !== undefined) {
                            return;
                        }
                        const type = params[i].name;
                        const dependency = DI.inject(type);
                        args[i] = dependency;
                    }
                }
                super(...args);
            }
        };
    };
}
