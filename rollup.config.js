import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const license = `/*!
 * tween-values
 * https://github.com/yomotsu/tween-values
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */`;

export default {
	input: 'src/index.ts',
	output: [
		{
			format: 'umd',
			name: 'TweenValues',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		typescript( { typescript: require( 'typescript' ) } ),
	],
};
