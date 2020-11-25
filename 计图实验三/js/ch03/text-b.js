"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var delay = 500;


function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		 0.5,  0.5,  0,
		 0.5,  -0.5,  0,
		 -0.5,  -0.5,  0,
		 
		 -0.5,  -0.5,  0,
		 -0.5, 0.5,  0,
		 0.5,  0.5,  0,
		 
		 0.5,  0.5,  0,
		 0.1, 0.7, 0,
		 0.1, 0.5, 0,
		 
		-0.5,  0.5,  0,
		-0.1, 0.7, 0,
		-0.1, 0.5, 0,
		
		-0.1, 0.9, 0,
		-0.1, 0.5, 0,
		0.1, 0.9, 0,
		
		0.1, 0.9, 0,
		0.1, 0.5, 0,
		-0.1, 0.5, 0

		
		
	
	];
	
	var colors=[
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		0.9,0.9,0.9,1.0,
		
		
	];
	
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
	
	// Associate external shader variables with data buffer
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	
	gl.drawArrays( gl.TRIANGLES, 0, 18 );
	// update and render
	
}

function change(){
	theta += 0.1;
	if( theta > 1/3 * Math.PI )
		theta -= (1/3 * Math.PI);
	gl.uniform1f( thetaLoc, theta );
	setTimeout( function(){ requestAnimFrame( renderSquare ); }, delay );
}