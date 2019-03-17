export interface Values {
    [key: string]: number;
}
export declare function cloneValues(values: Values): Values;
export declare function lerpValues(a: Values, b: Values, alpha: number, out: Values): void;
