/**
 * default.operators.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { OperatorsInterface } from '../core';

export class Operators implements OperatorsInterface {
    between;
    betweenInc;
    greaterOrEqual;
    lessOrEqual;
    notEqual;
    greater;
    less;
    equal;
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
