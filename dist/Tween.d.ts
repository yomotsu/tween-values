import { EventDispatcher } from './EventDispatcher';
import { Easing } from './Easings';
import { Values } from './Values';
export declare class Tween extends EventDispatcher {
    easing: Easing;
    private _running;
    private _startValues;
    private _endValues;
    private _currentValues;
    private _duration;
    private _elapsed;
    constructor(startValues: Values, endValues: Values, duration: number, easing?: Easing);
    readonly running: boolean;
    readonly progress: number;
    readonly currentValues: Values;
    reset(): this;
    play(): this;
    pause(): this;
    update(delta: number): this;
    dispose(): void;
}
