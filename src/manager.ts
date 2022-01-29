import { TweenGroup } from './TweenGroup';

export const activeTweens = new TweenGroup();

export function isRunning(): boolean {

	return activeTweens.isRunning();

}

export const tweenManager = new TweenGroup();
