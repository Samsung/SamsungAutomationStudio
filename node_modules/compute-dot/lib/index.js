'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	isFunction = require( 'validate.io-function' );


// DOT PRODUCT //

/**
* FUNCTION: dot( x, y[, accessor] )
*	Computes the dot product between two arrays.
*
* @param {Array} x - input array
* @param {Array} y - input array
* @param {Function} [accessor] - accessor function for accessing array values
* @returns {Number|Null} dot product
*/
function dot( x, y, clbk ) {
	if ( !isArray( x ) ) {
		throw new TypeError( 'dot()::invalid input argument. First argument must be an array. Value: `' + x + '`.' );
	}
	if ( !isArray( y ) ) {
		throw new TypeError( 'dot()::invalid input argument. Second argument must be an array. Value: `' + y + '`.' );
	}
	if ( arguments.length > 2 ) {
		if ( !isFunction( clbk ) ) {
			throw new TypeError( 'dot()::invalid input argument. Accessor must be a function. Value: `' + clbk + '`.' );
		}
	}
	var len = x.length,
		sum = 0,
		i;

	if ( len !== y.length ) {
		throw new Error( 'dot()::invalid input argument. Arrays must be of equal length.' );
	}
	if ( !len ) {
		return null;
	}
	if ( clbk ) {
		for ( i = 0; i < len; i++ ) {
			sum += clbk( x[ i ], i, 0 ) * clbk( y[ i ], i, 1 );
		}
	} else {
		for ( i = 0; i < len; i++ ) {
			sum += x[ i ] * y[ i ];
		}
	}
	return sum;
} // end FUNCTION dot()


// EXPORTS //

module.exports = dot;
