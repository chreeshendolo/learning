console.log( "maths.js up!" );

var Maths = {};

Maths.lerp = function( start, end, n ) {
	return ( start + n * ( end - start ) );
};
