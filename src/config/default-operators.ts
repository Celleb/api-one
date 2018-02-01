/**
 * default.operators.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

//import { Operators } from '../core/types';

export class Operators {
    equal: string;
    notEqual: string;
    greaterOrEqual: string;
    lessOrEqual: string;
    lessOrGreater: string;
    greater: string;
    lesser: string;
}

export const defaultOperators: Operators = {
    equal: ':',
    notEqual: '!:',
    greaterOrEqual: '>:',
    lessOrEqual: '<:',
    lessOrGreater: '<>',
    greater: '>',
    lesser: '<'
};
