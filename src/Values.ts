import { lerp } from './utils';

export interface Values {
	[ key: string ]: number;
}

export function cloneValues( values: Values ): Values {

	return Object.assign( {}, values );

}

export function lerpValues( a: Values, b: Values, alpha: number, out: Values ): void {

	for (const key in out ) {

		out[ key ] = lerp( a[ key ], b[ key ], alpha );

	}

}
