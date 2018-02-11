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
    between: string;
    betweenInc: string;
    greaterOrEqual: string;
    lessOrEqual: string;
    notEqual: string;
    greater: string;
    less: string;
    equal: string;
}

export const defaultOperators: Operators = {
    betweenInc: '<:>',
    between: '<>',
    greaterOrEqual: '>:',
    lessOrEqual: '<:',
    notEqual: '!:',
    greater: '>',
    less: '<',
    equal: ':',
};
