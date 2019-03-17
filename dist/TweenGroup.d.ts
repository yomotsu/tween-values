import { EventDispatcher } from './EventDispatcher';
import { Tween } from './Tween';
export declare class TweenGroup extends EventDispatcher {
    private _group;
    constructor(...tweens: Tween[]);
    add(...tweens: Tween[]): void;
    remove(...tweens: Tween[]): void;
    update(delta: number): void;
    isRunning(): boolean;
}
