import { EventDispatcher } from './EventDispatcher';
import { Easing, easeLinear } from './easings';
import { Values, cloneValues, lerpValues } from './Values';
import { activeTweens } from './manager';

export class Tween extends EventDispatcher {

	public easing: Easing;

	private _running: boolean = false;
	private _startValues!: Values;
	private _endValues!: Values;
	private _currentValues!: Values;
	private _duration: number;
	private _elapsed: number = 0;

	constructor( startValues: Values, endValues: Values, duration: number, easing: Easing = easeLinear ) {

		super();

		this._startValues = startValues;
		this._endValues = endValues;
		this._duration = duration;

		this.easing = easing;
		this._currentValues = cloneValues( startValues );

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

	public reset(): this {

		this._running = false;
		this._elapsed = 0;

		return this;

	}

	public play(): this {

		this._running = true;
		activeTweens.add( this );
		this.dispatchEvent( { type: 'started'} );

		return this;

	}

	public pause(): this {

		this._running = false;
		activeTweens.remove( this );
		this.dispatchEvent( { type: 'paused'} );

		return this;

	}

	public update( delta: number ): this {

		if ( ! this._running ) return this;

		this._elapsed += delta;

		if ( this._duration <= this._elapsed ) {

			this._elapsed = this._duration;
			this._running = false;
			this._currentValues = cloneValues( this._endValues );
			this.dispatchEvent( { type: 'update' } );
			this.dispatchEvent( { type: 'ended' } );
			activeTweens.remove( this );

			return this;

		}

		lerpValues(
			this._startValues,
			this._endValues,
			this.easing( this.progress ),
			this._currentValues,
		);
		this.dispatchEvent( { type: 'update' } );

		return this;

	}

	public dispose(): void {

		this.removeAllEventListeners();

	}

}
