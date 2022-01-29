import { EventDispatcher } from './EventDispatcher';
import type { Listener } from './EventDispatcher';
import { easeLinear } from './easings';
import type { Easing } from './easings';
import { Values, cloneValues, lerpValues } from './Values';
import { activeTweens } from './manager';
export type TweenEventMap = {
	started: { type: 'started' };
	paused : { type: 'paused' };
	update: { type: 'update', currentValues: Values };
	ended: { type: 'ended', currentValues: Values };
};

type TweenOptions = {
	easing?: Easing;
	onStart?: () => void;
	onUpdate?: () => void;
	onEnd?: () => void;
}

export class Tween extends EventDispatcher {

	public easing: Easing;
	public onStart?: () => void;
	public onUpdate?: () => void;
	public onEnd?: () => void;

	private _running: boolean = false;
	private _startValues!: Values;
	private _endValues!: Values;
	private _currentValues!: Values;
	private _duration: number;
	private _elapsed: number = 0;

	constructor( startValues: Values, endValues: Values, duration: number, { easing, onStart, onUpdate, onEnd }: TweenOptions ) {

		super();

		this._startValues = startValues;
		this._endValues = endValues;
		this._duration = duration;

		this.easing = easing || easeLinear;
		this._currentValues = cloneValues( startValues );
		this.onStart = onStart;
		this.onUpdate = onUpdate;
		this.onEnd = onEnd;

		return this;

	}

	get running(): boolean {

		return this._running;

	}

	get progress(): number {

		return this._elapsed / this._duration;

	}

	get currentValues(): Values {

		return this._currentValues;

	}

	get startValue(): Values {

		return this._startValues;

	}

	get endValue(): Values {

		return this._endValues;

	}

	public reset(): this {

		this._running = false;
		this._elapsed = 0;

		return this;

	}

	public start(): this {

		this._running = true;
		activeTweens.add( this );
		this.onStart && this.onStart();
		this.dispatchEvent( { type: 'started' } );

		return this;

	}

	public pause(): this {

		this._running = false;
		activeTweens.remove( this );
		this.onEnd && this.onEnd();
		this.dispatchEvent( { type: 'paused' } );

		return this;

	}

	public update( delta: number ): this {

		if ( ! this._running ) return this;

		this._elapsed += delta;

		if ( this._duration <= this._elapsed ) {

			this._elapsed = this._duration;
			this._running = false;
			this._currentValues = cloneValues( this._endValues );
			this.onUpdate && this.onUpdate();
			this.dispatchEvent( { type: 'update', currentValues: cloneValues( this._currentValues ) } );
			this.dispatchEvent( { type: 'ended', currentValues: cloneValues( this._currentValues ) } );
			activeTweens.remove( this );

			return this;

		}

		lerpValues(
			this._startValues,
			this._endValues,
			this.easing( this.progress ),
			this._currentValues,
		);
		this.onUpdate && this.onUpdate();
		this.dispatchEvent( { type: 'update', currentValues: cloneValues( this._currentValues ) } );

		return this;

	}

	public dispose(): void {

		this.removeAllEventListeners();

	}

	addEventListener<K extends keyof TweenEventMap>(
		type: K,
		listener: ( event: TweenEventMap[ K ] ) => any,
	): void {

		super.addEventListener( type, listener as Listener );

	}

	removeEventListener<K extends keyof TweenEventMap>(
		type: K,
		listener: ( event: TweenEventMap[ K ] ) => any,
	): void {

		super.removeEventListener( type, listener as Listener );

	}

}
