export type Easing = ( t: number ) => number;
export function easeLinear( t: number ): number {

	return t;

}

export function easeOutSine( t: number ): number {

	return Math.sin( ( t * Math.PI ) * 0.5 );

}

export function easeInSine( t: number ): number {

  return 1 - Math.cos( ( t * Math.PI ) * 0.5 );

}

export function easeInOutSine( t: number ): number {

	return - ( Math.cos( Math.PI * t ) - 1 ) * 0.5;

}

export function easeInCubic( t: number ): number {

	return t * t * t;

	}

export function easeOutCubic(x: number): number {

	return 1 - Math.pow( 1 - x, 3 );

}

export function easeInOutCubic(t: number): number {

	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow( - 2 * t + 2, 3 ) * 0.5;

}

export function easeInExpo( t: number ): number {

	return t === 0 ? 0 : Math.pow( 1024, t - 1 );

}

export function easeOutExpo( t: number ): number {

	return t === 1 ? 1 : 1 - Math.pow( 2, - 10 * t );

}

export function easeInOutExpo( t: number ): number {

	if ( t === 0 ) return 0;
	if ( t === 1 ) return 1;
	if ( ( t *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, t - 1 );

	return 0.5 * ( - Math.pow( 2, - 10 * ( t - 1 ) ) + 2 );

}

const c1 = 1.70158;
const c3 = c1 + 1;

export function easeOutBack( t: number ): number {

	return 1 + c3 * Math.pow( t - 1, 3 ) + c1 * Math.pow( t - 1, 2 );

}
