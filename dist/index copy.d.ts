import { EventDispatcher } from './EventDispatcher';
export interface Values {
    [key: string]: number;
}
export declare type Easing = (t: number) => number;
export declare class Tween extends EventDispatcher {
    static isRunning(): boolean;
    easing: Easing;
    private _running;
    private _startValues;
    private _endValues;
    private _currentValues;
    private _duration;
    private _elapsed;
    constructor(startValues: Values, endValues: Values, duration: number, easing?: Easing);
    readonly progress: number;
    readonly currentValues: Values;
    reset(): this;
    play(): this;
    update(delta: number): this;
    dispose(): void;
}
