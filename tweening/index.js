var Tween = new Tweening();
var Render = new Rendering();
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
	c: 'grey'
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
var easeButton = function( t, x, y, w, h, f ) {
	this.t = t;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = "white";
	this.f = f;
	
	easeButtons.push( this );
};

var createButtons = function() {
	
	var enl = easeNames.length,
		x = rightPanel.x,
		y = 0;
	
	
	for( var i = 0; i < enl; ++i ) {
		var name = easeNames[ i ];
		

		var font = 10;
		ctx.font = font + "px Arial";
		var txtWidth = ctx.measureText( name ).width;
		
		var txt = {
			x: x + rightPanel.w * .5 - txtWidth * .5,
			y: y,
			w: txtWidth,
			h: 9,
			f: font
		}
		
		var bttn = new easeButton( name, txt.x, txt.y, txt.w, txt.h, txt.f )
		
		if( i === 0 ) { 
			bttn.c = "red";
			selectedEase = bttn;
		}
		
		y += 11;
	}
}

createButtons();

var boxes = [];

var boxEnt = function( x, y, w, h, c, dest ) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = 0;
	this.c = c;
	
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
	
	Tween.createTween( this, this.tweens[ this.state ], 1000, selectedEase.t );
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

				selectedEase.c = "white";
				selectedEase = bttn;
				selectedEase.c = "red";
			}
		}
		
		input.mouseState.left.down = false;
	}
	
}


var lastTime = 0;

var loop = function( t ) {
	requestAnimationFrame( loop );
	
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
	
	for( var i = easeButtons.length - 1; i >= 0; --i ) {
		var bttn = easeButtons[ i ];
		
		Render.createRender( bttn, [ 'fillText' ] );
	}
	
	Render.createRender( rightPanel );
	
	for( var i = boxes.length - 1; i >= 0; --i ) {
		var box = boxes[ i ];
		Render.createRender( box, [ 'fillRect', 'strokeRect' ] );
	}
	
	Render.update();
	

}



requestAnimationFrame( loop );