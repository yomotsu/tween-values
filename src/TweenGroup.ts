import { EventDispatcher } from './EventDispatcher';
import { Tween } from './Tween';

export class TweenGroup extends EventDispatcher {

	private _group: Tween[] = [];

	constructor ( ...tweens: Tween[] ) {

		super();
		this.add( ...tweens );

	}

	public add( ...tweens: Tween[] ): void {

		tweens.forEach( ( tween ) => {
			
			if ( this._group.indexOf( tween ) !== - 1 ) return;

			this._group.push( tween );
			
		} );

	}

	remove( ...tweens: Tween[] ): void {

		tweens.forEach( ( tween ) => {

			const index = this._group.indexOf( tween );

			if ( index === - 1 ) return;

			this._group.splice( index, 1 );

		} );

	}

	public update( delta: number ): void {

		return this._group.forEach( ( tween ) => tween.update( delta ) );

	}

	public isRunning(): boolean {

		return this._group.some( ( tween ) => tween.running );

	}

}
