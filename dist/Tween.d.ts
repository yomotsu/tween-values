import { EventDispatcher } from './EventDispatcher';
import type { Easing } from './easings';
import { Values } from './Values';
export declare type TweenEventMap = {
    started: {
        type: 'started';
    };
    paused: {
        type: 'paused';
    };
    update: {
        type: 'update';
        currentValues: Values;
    };
    ended: {
        type: 'ended';
        currentValues: Values;
    };
};
declare type TweenOptions = {
    easing?: Easing;
    onStart?: () => void;
    onUpdate?: () => void;
    onEnd?: () => void;
};
export declare class Tween extends EventDispatcher {
    easing: Easing;
    onStart?: () => void;
    onUpdate?: () => void;
    onEnd?: () => void;
    private _running;
    private _startValues;
    private _endValues;
    private _currentValues;
    private _duration;
    private _elapsed;
    constructor(startValues: Values, endValues: Values, duration: number, { easing, onStart, onUpdate, onEnd }?: TweenOptions);
    get running(): boolean;
    get progress(): number;
    get currentValues(): Values;
    get startValue(): Values;
    get endValue(): Values;
    reset(): this;
    start(): this;
    pause(): this;
    update(delta: number): this;
    dispose(): void;
    addEventListener<K extends keyof TweenEventMap>(type: K, listener: (event: TweenEventMap[K]) => any): void;
    removeEventListener<K extends keyof TweenEventMap>(type: K, listener: (event: TweenEventMap[K]) => any): void;
}
export {};
