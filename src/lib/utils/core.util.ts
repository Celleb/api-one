/**
 * core.util.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */


export class CoreUtilities {

    private static falseValues = ['no', 'false'];
    private static trueValues = ['yes', 'true'];

    /**
     * Checks if an item is an object
     * @param {any} item
     * @returns {boolean}
     */
    static isObject(item: any): boolean {
        return item === Object(item);
    }

    /**
     * Checks if an items is an object excluding arrays
     * @param {any} item
     * @returns {boolean}
     */
    static isRealObject(item: any): boolean {
        return Array.isArray(item) ? false : this.isObject(item);
    }

    /**
     * Converts string values `yes`, `true` to boolean true and `no`, `false` to boolean false
     */
    static strToBool(value: string | boolean): boolean {
        if (value === true || value === false) {
            return value;
        }
        if (this.trueValues.indexOf(value) !== -1) {
            return true;
        }
        if (this.falseValues.indexOf(value) !== -1) {
            return false;
        }
        return null;
    }

    /**
     * Splits a string into substrings using the specified seperator, removes spaces and
     * returns them as an array.
     * @param string
     * @param splitter
     */
    static split(string: string, splitter: string = ','): Array<string> {
        splitter = '\\s*' + splitter + '\\s*';
        const regex = new RegExp(splitter);
        console.log(regex);
        return string.split(regex);
    }
}
export const $$ = CoreUtilities;
