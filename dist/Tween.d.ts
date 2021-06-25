import { EventDispatcher } from './EventDispatcher';
import type { Easing } from './easings';
import { Values } from './Values';
export interface TweenEventMap {
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
}
export declare class Tween extends EventDispatcher {
    easing: Easing;
    private _running;
    private _startValues;
    private _endValues;
    private _currentValues;
    private _duration;
    private _elapsed;
    constructor(startValues: Values, endValues: Values, duration: number, easing?: Easing);
    get running(): boolean;
    get progress(): number;
    get currentValues(): Values;
    reset(): this;
    play(): this;
    pause(): this;
    update(delta: number): this;
    dispose(): void;
    addEventListener<K extends keyof TweenEventMap>(type: K, listener: (event: TweenEventMap[K]) => any): void;
    removeEventListener<K extends keyof TweenEventMap>(type: K, listener: (event: TweenEventMap[K]) => any): void;
}
