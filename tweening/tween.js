console.log( "tween.js up!" );

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

