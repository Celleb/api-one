export interface OperatorsInterface {
    equal: (...args) => any | string;
    between: (...args) => any | string;
    betweenInc: (...args) => any | string;
    greater: (...args) => any | string;
    greaterOrEqual: (...args) => any | string;
    less: (...args) => any | string;
    lessOrEqual: (...args) => any | string;
    notEqual: (...args) => any | string;
}