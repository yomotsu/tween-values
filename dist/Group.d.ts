import { EventDispatcher } from './EventDispatcher';
import { Tween } from './Tween';
export declare class TweenGroup extends EventDispatcher {
    private _group;
    add(tween: Tween): void;
    update(delta: number): void;
    isRunning(): boolean;
}
