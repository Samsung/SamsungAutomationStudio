L2 norm
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Computes the L2 norm ([Euclidean norm](http://en.wikipedia.org/wiki/Norm_(mathematics))) of an array.


## Installation

``` bash
$ npm install compute-l2norm
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var l2norm = require( 'compute-l2norm' );
```

#### l2norm( arr[, accessor] )

Computes the _L2_ norm (Euclidean norm) of an `array`.

``` javascript
var data = [ 2, 7, 3, -3, 9 ];

var norm = l2norm( data );
// returns ~12.3288
```

For object `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
var data = [
	['beep', 3],
	['boop', 4]
];

function getValue( d, i ) {
	return d[ 1 ];
}

var norm = l2norm( data, getValue );
// returns 5
```

If provided an empty `array`, the function returns `null`.


## Examples

``` javascript
var l2norm = require( 'compute-l2norm' );

var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random() * 100;
}

console.log( l2norm( data ) );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## References

- 	Dahlquist, Germund and Bjorck, Ake. _Numerical Methods in Scientific Computing_.
- 	Blue, James (1978) "A Portable Fortran Program To Find the Euclidean Norm of a Vector". _ACM Transactions on Mathematical Software_.
- 	Higham, Nicholas J. _Accuracy and Stability of Numerical Algorithms, Second Edition_.

This module implements a one-pass algorithm proposed by S.J. Hammarling.


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


[npm-image]: http://img.shields.io/npm/v/compute-l2norm.svg
[npm-url]: https://npmjs.org/package/compute-l2norm

[travis-image]: http://img.shields.io/travis/compute-io/l2norm/master.svg
[travis-url]: https://travis-ci.org/compute-io/l2norm

[coveralls-image]: https://img.shields.io/coveralls/compute-io/l2norm/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/l2norm?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/l2norm.svg
[dependencies-url]: https://david-dm.org/compute-io/l2norm

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/l2norm.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/l2norm

[github-issues-image]: http://img.shields.io/github/issues/compute-io/l2norm.svg
[github-issues-url]: https://github.com/compute-io/l2norm/issues
