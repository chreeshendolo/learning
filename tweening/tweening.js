console.log( "tweening.js up!" );

var Tweening = function() {
		this.tweens = [];
	};
	
var proto = Tweening.prototype;

proto.createTween = function( target, props, duration ) {
			var start = {};
			
			for( var key in props ) {
				start[ key ] = target[ key ];
			};

			this.tweens.push( {
				target: target,
				start: start,
				end: props,
				duration: duration,
				elapsed: 0		
			} );
		};

proto.run = function( dt, endTween ) {
	for( var i = this.tweens.length - 1; i >= 0; --i ) {
		var tween = this.tweens[ i ];
		
		tween.elapsed += dt;
		
		var n = tween.elapsed / tween.duration;
		
		for( var key in  tween.start ) {
			tween.target[ key ] = Maths.lerp( tween.start[ key ], tween.end[ key ], n );
		}
		
		if ( tween.elapsed >= tween.duration ) {
			
			for( var key in  tween.start ) {
				tween.target[ key ] = tween.end[ key ];
			}
			
			if( endTween ) tween.target[ endTween ]( tween.target );
			
			this.tweens.splice( i, 1 );
		}
	}
}