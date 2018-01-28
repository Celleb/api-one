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
     * Determines whether the given input is an object.
     * @param item
     */
    static isObject(item: any): boolean {
        return item === Object(item);
    }

    /**
     * Determines whether the given inpite is an object but not an array.
     * @param item
     */
    static isRealObject(item: any): boolean {
        return Array.isArray(item) ? false : this.isObject(item);
    }

    /**
     * Converts specified string values to their equivalent boolean values.
     * Values `yes` and `true` are converted to boolean true.
     * Values `no` and `false` are converted to boolean false.
     * Otherwise it returns null.
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
        return string.split(regex);
    }
}
export const $$ = CoreUtilities;
