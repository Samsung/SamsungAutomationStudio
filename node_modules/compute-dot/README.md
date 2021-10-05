Dot Product
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the [dot product](http://en.wikipedia.org/wiki/Dot_product) between two arrays.


## Installation

``` bash
$ npm install compute-dot
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var dot = require( 'compute-dot' );
```

#### dot( x, y[, accessor] )

Computes the [dot product](http://en.wikipedia.org/wiki/Dot_product) between two `arrays` of equal length.

``` javascript
var val = dot( [1,2,3], [4,5,6] );
// returns 32
```

To compute the [dot product](http://en.wikipedia.org/wiki/Dot_product) between nested `array` values, provide an accessor `function` for accessing `numeric` values.

``` javascript
var x = [
	{'x':2},
	{'x':4},
	{'x':5}
];

var y = [
	[1,3],
	[2,1],
	[3,5]
];

function getValue( d, i, j ) {
	if ( j === 0 ) {
		return d.x;
	}
	return d[ 1 ];
}

var val = dot( x, y, getValue );
// returns 35
```

The accessor `function` is provided three arguments:

-	__d__: current datum.
-	__i__: current datum index.
-	__j__: array index; e.g., array `x` has index `0` and array `y` has index `1`.


If provided empty `arrays`, the function returns `null`.


## Examples

``` javascript
var dot = require( 'compute-dot' );

// Simulate some data...
var x = new Array( 100 ),
	y = new Array( 100 );

var val;
for ( var i = 0; i < x.length; i++ ) {
	val = Math.round( Math.random()*100 ) + 1;
	x[ i ] = val;
	if ( i % 2 === 0 ) {
		val = -val;
	}
	y[ i ] = 1 / val;
}

console.log( dot( x, y ) );
// returns ~0 (floating-point errors)
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2014-2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/compute-dot.svg
[npm-url]: https://npmjs.org/package/compute-dot

[travis-image]: http://img.shields.io/travis/compute-io/dot/master.svg
[travis-url]: https://travis-ci.org/compute-io/dot

[coveralls-image]: https://img.shields.io/coveralls/compute-io/dot/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/dot?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/dot.svg
[dependencies-url]: https://david-dm.org/compute-io/dot

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/dot.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/dot

[github-issues-image]: http://img.shields.io/github/issues/compute-io/dot.svg
[github-issues-url]: https://github.com/compute-io/dot/issues
