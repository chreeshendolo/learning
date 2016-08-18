var Tween = new Tweening();

console.log("yeah bud");

var stage = document.createElement( "canvas" );

var ctx = stage.getContext( "2d" );

document.body.appendChild( stage );

stage.width = 320;
stage.height = 240;

var rightPanel = {
	x: stage.width,
	y: 0,
	w: 64,
	h: stage.height,
	color: 'grey'
}

stage.width += rightPanel.w;

var input = {
	mouseState: {
		left: {
			down: false,
			pos: {
				x: 0,
				y: 0
			}
		}
	},
	listen: function( canv ) {
		canv.addEventListener( "mousedown", function( e ) {
			this.mouseState.left.down = true;
			this.mouseState.left.pos = {
				x: e.offsetX,
				y: e.offsetY
			};
		}.bind( this ), false );
	}
};

input.listen( stage );



var getEaseNames = function(){
	var names = [];
	for( var key in Ease ) {
		names.push( key );
	}
	
	return names;
}

var easeNames = getEaseNames();

var selectedEase = {};

var easeButtons = [];
var easeButton = function( name, x, y, w, h ) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = "white";
	
	easeButtons.push( this );
};

var createButtons = function() {
	
	var enl = easeNames.length,
		x = rightPanel.x,
		y = 0;
	
	
	for( var i = 0; i < enl; ++i ) {
		var name = easeNames[ i ];
		

		
		ctx.font = "10px Arial";
		var txtWidth = ctx.measureText( name ).width;
		
		var txt = {
			x: x + rightPanel.w * .5 - txtWidth * .5,
			y: y,
			w: txtWidth,
			h: 9
		}
		
		var bttn = new easeButton( name, txt.x, txt.y, txt.w, txt.h )
		
		if( i === 0 ) { 
			bttn.color = "red";
			selectedEase = bttn;
		}
		
		y += 11;
	}
}

createButtons();

var boxes = [];

var boxEnt = function( x, y, w, h, color, dest ) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = 0;
	this.color = color;
	
	this.tweening = 0;
	
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
	
	Tween.createTween( this, this.tweens[ this.state ], 1000, selectedEase.name );
}

new boxEnt( 0, 0, 32, 32, "green", { x: 288, y: 208, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 288, 0, 32, 32, "blue", { x: 0, y: 208, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 0, 208, 32, 32, "yellow", { x: 288, y: 0, w: 32, h: 32, r: Math.PI * 2 } );
new boxEnt( 288, 208, 32, 32, "red", { x: 0, y: 0, w: 32, h: 32, r: Math.PI * 2 } );


var checkClick = function() {
	if( input.mouseState.left.down ) {
		var x = input.mouseState.left.pos.x,
			y = input.mouseState.left.pos.y;
			
		for( var i = easeButtons.length - 1; i >= 0; --i ) {
			var bttn = easeButtons[ i ];
			
			var lrc = ( x > bttn.x && x < bttn.x + bttn.w );
			var tbc = ( y > bttn.y && y < bttn.y + bttn.h );
			
			if( lrc && tbc ) {

				selectedEase.color = "white";
				selectedEase = bttn;
				selectedEase.color = "red";
			}
		}
		
		input.mouseState.left.down = false;
	}
	
}


var lastTime = 0;

var render = function( t ) {
	requestAnimationFrame( render );
	
	var dt = t - lastTime;
	
	lastTime = t;
	
	for( var i = boxes.length - 1; i >= 0; --i ) {
		var box = boxes[ i ];
		if( !box.tweening ) {
			box.nextTween();
		}
	}
	
	Tween.update( dt );
	
	checkClick();
	
	ctx.fillStyle = "black";
	ctx.fillRect( 0, 0, stage.width, stage.height );

	ctx.fillStyle = rightPanel.color;
	ctx.fillRect( rightPanel.x, rightPanel.y, rightPanel.w, rightPanel.h );
	
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
	
	for( var i = easeButtons.length - 1; i >= 0; --i ) {
		var bttn = easeButtons[ i ];
		
		ctx.fillStyle = bttn.color;
		ctx.fillText( bttn.name, bttn.x, bttn.y + 7 );
	}
}



requestAnimationFrame( render );