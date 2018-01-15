/**
 * core.util.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */


export class CoreUtilities {
    static isObject(object: any): boolean {
        return object === Object(object);
    }

    static isRealObject(object: any): boolean {
        return Array.isArray(object) ? false : this.isObject(object);
    }
}
export const $$ = CoreUtilities;
