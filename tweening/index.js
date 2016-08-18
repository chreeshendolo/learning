var Tween = new Tweening();

console.log("yeah bud");

var stage = document.createElement( "canvas" );

var ctx = stage.getContext( "2d" );

document.body.appendChild( stage );

stage.width = 320;
stage.height = 240;

var boxes = [];

var boxEnt = function( x, y, w, h, color, dest ) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = 0;
	this.color = color;
	
	this.tweens = [
		{ x: x, y: y, w: w,	h: h, r: 0 },
		{ x: stage.width * .5 - w * .5, y: stage.height * .5 - h * .5, w: w * 2, h: h * 2, r: Math.PI * 1 },
		dest
	];
	this.inc = -1;
	this.state = 0;
	
	boxes.push( this );
}

boxEnt.prototype.nextTween = function() {
	if ( this.state === 0 || this.state === 2 ) {
		this.inc *= -1;
	}
	
	this.state += this.inc;
	
	Tween.createTween( this, this.tweens[ this.state ], 1000 );
}

new boxEnt( 0, 0, 32, 32, "green", { x: 288, y: 208, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 288, 0, 32, 32, "blue", { x: 0, y: 208, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 0, 208, 32, 32, "yellow", { x: 288, y: 0, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 288, 208, 32, 32, "red", { x: 0, y: 0, w: 32, h: 32, r: Math.PI * 2 } );


for( var i = boxes.length - 1; i >= 0; --i ) {
	var box = boxes[ i ];
	box.nextTween();
}

var lastTime = 0;

var render = function( t ) {
	requestAnimationFrame( render );
	
	var dt = t - lastTime;
	
	lastTime = t;
	
	for( var i = Tween.tweens.length - 1; i >= 0; --i ) {
		var tween = Tween.tweens[ i ];
		
		tween.elapsed += dt;
		
		var n = tween.elapsed / tween.duration;
		
		for( var key in  tween.start ) {
			tween.target[ key ] = Maths.lerp( tween.start[ key ], tween.end[ key ], n );
		}
		
		if ( tween.elapsed >= tween.duration ) {
			
			for( var key in  tween.start ) {
				tween.target[ key ] = tween.end[ key ];
			}
			
			tween.target.nextTween( tween.target );
			
			Tween.tweens.splice( i, 1 );
		}
	}
	
	ctx.fillStyle = "black";
	ctx.fillRect( 0, 0, stage.width, stage.height );
	
	for( var i = boxes.length - 1; i >= 0; --i ) {
		var box = boxes[ i ];
		
		var bx = box.x,
			by = box.y,
			bw = box.w,
			bh = box.h,
			bwh = bw * .5,
			bhh = bh * .5;
		
		ctx.save();
				
		ctx.translate( bx + bwh, by + bhh );
		
		ctx.rotate( box.r );
		
		ctx.fillStyle = box.color;
		ctx.fillRect( -bwh, -bhh, bw, bh );
		
		ctx.restore();
	}
}

requestAnimationFrame( render );