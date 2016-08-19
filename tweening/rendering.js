console.log( "rendering.js up!" );

var Rendering = function() {
		this.renders = [];
	};
	
var proto = Rendering.prototype;

proto.createRender = function( target, styles ) {
			
			var base = function() {
				this.x = target.x,
				this.y = target.y,
				this.w = target.w,
				this.h = target.h,
				this.r = target.r,
				this.c = target.c;
			}
			
			var views = {
				fillRect: function(){
					var tempBase = new base();
					tempBase.s = "fillRect";
					
					return tempBase;
				},
				strokeRect: function(){
					var tempBase = new base();
					tempBase.lw = 2;
					tempBase.s = "strokeRect";
					
					return tempBase;
				},
				fillText: function(){
					var tempBase = new base();
					tempBase.t = target.t;
					tempBase.f = target.f;
					tempBase.s = "fillText";
					
					return tempBase;
				}
			};
			
			
			
			if( styles ) {
			
				var sl = styles.length;
				
				for( var i = 0; i < sl; ++i ) {
					var style = styles[ i ];
					
					this.renders.push( views[ style ]() );
				}
			}
			else {
				this.renders.push( views.fillRect() );
			}
		};

proto.update = function() {
	ctx.fillStyle = "black";
	ctx.fillRect( 0, 0, stage.width, stage.height );
	
	for( var i = this.renders.length - 1; i >= 0; --i ) {
		var render = this.renders[ i ];

		var	t = render.t,
			s = render.s,
			f = render.f,
			c = render.c,
			r = render.r,
			rx = render.x,
			ry = render.y,
			rw = render.w,
			rh = render.h,
			rwh = rw * .5,
			rhh = rh * .5;
		
		ctx.save();
				
		ctx.translate( rx + rwh, ry + rhh );
		
		ctx.rotate( r );
		
		ctx.fillStyle = c;
		
		if( s == 'fillRect' ) ctx.fillRect( -rwh, -rhh, rw, rh );
		
		if( s == 'strokeRect' ) {
			rwh += render.lw;
			rhh += render.lw;
			rw += render.lw * 2;
			rh += render.lw * 2;
			
			ctx.fillStyle = "white";
			ctx.fillRect( -rwh, -rhh, rw, rh );
		}
		
		if( s == 'fillText' ) {
			ctx.font = f + "px Arial";
			rhh -= f * .8;
			ctx.fillText( t, -rwh, -rhh );
		}
		
		ctx.restore();
		
		this.renders.splice( i, 1 );
	}
}