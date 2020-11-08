"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];

var numTimesToSubdivide;

var theta;

function getMySelect() {
	theta = document.getElementById("degree").value;
	numTimesToSubdivide = document.getElementById("rank").value;
}

window.onload = function(){
	initTriangles();
}

function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		 0.0,  0.5,  0,
        -0.25*Math.sqrt(3), -0.25,  0,
         0.25*Math.sqrt(3), -0.25,  0,
	];
	points = [];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle( u, v, w, numTimesToSubdivide );

	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles();
};

function triangle( a, b, c ){

	//ab
	points.push( a[0]*Math.cos(theta*Math.PI/180)-a[1]*Math.sin(theta*Math.PI/180), 
	             a[1]*Math.cos(theta*Math.PI/180)+a[0]*Math.sin(theta*Math.PI/180),
				 a[2] );
	points.push( b[0]*Math.cos(theta*Math.PI/180)-b[1]*Math.sin(theta*Math.PI/180),
	             b[1]*Math.cos(theta*Math.PI/180)+b[0]*Math.sin(theta*Math.PI/180),
				 b[2] );
	//bc
	points.push( b[0]*Math.cos(theta*Math.PI/180)-b[1]*Math.sin(theta*Math.PI/180),
	             b[1]*Math.cos(theta*Math.PI/180)+b[0]*Math.sin(theta*Math.PI/180),
				 b[2] );
	points.push( c[0]*Math.cos(theta*Math.PI/180)-c[1]*Math.sin(theta*Math.PI/180),
	             c[1]*Math.cos(theta*Math.PI/180)+c[0]*Math.sin(theta*Math.PI/180),
				 c[2] );
	//ca
	points.push( c[0]*Math.cos(theta*Math.PI/180)-c[1]*Math.sin(theta*Math.PI/180),
	             c[1]*Math.cos(theta*Math.PI/180)+c[0]*Math.sin(theta*Math.PI/180),
				 c[2] );
	points.push( a[0]*Math.cos(theta*Math.PI/180)-a[1]*Math.sin(theta*Math.PI/180),
	             a[1]*Math.cos(theta*Math.PI/180)+a[0]*Math.sin(theta*Math.PI/180),
				 a[2] );
	
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		//--count;

		// four new triangles
		divideTriangle( a, ab, ca, count-1 );
		divideTriangle( b, bc, ab, count-1 );
		divideTriangle( c, ca, bc, count-1 );
		divideTriangle( ab, bc, ca, count-1);
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.drawArrays( gl.TRIANGLES, 0, points.length/3 );
	gl.drawArrays(gl.LINES,0,points.length/3);
}