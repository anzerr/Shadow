
var angle = function( x1, y1, x2, y2 ) {
	return ( Math.atan2( y2-y1, x2-x1 ) );
}

var distance = function( x1, y1, x2, y2 ) {
	return Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) );
}

var isset = function( a ) { 
	return ( a && typeof(a) != "undefined" ) 
}

var rayTrace =  function( canvas, call ) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	this.data = this.context.getImageData(0, 0, this.canvas.height, this.canvas.width ).data
	
	this.dcall = function( a, x, y ) { var c = a.getColor( x, y ); return( c.r != 0 || c.g != 0 || c.b != 0 ); };
	this.call = ( (isset(call))? call : this.dcall );
	this.draw = true;
}

rayTrace.prototype.getColor = function( x, y ) {
	var p = ( (this.canvas.width*y)+x )*4
	return ( { 'r':this.data[p], 'g':this.data[p+1], 'b':this.data[p+2] } );
}

rayTrace.prototype.run = function( x0, y0, x1, y1 ) {
	var dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
	var sx = ( (x0 < x1) ? 1 : -1 ), sy = ( (y0 < y1) ? 1 : -1 );
	var err = dx-dy;

	while(true){
		if ( this.draw ) {
			this.context.fillStyle = ( (this.dcall(this, x0, y0))? "red" : "green" );
			this.context.fillRect(x0,y0,1,1);
		}

		if ( this.call( this, x0, y0 ) ) break;
		if ( (x0==x1) && (y0==y1) ) break;
			var e2 = 2*err;
			if (e2 >-dy){ err -= dy; x0  += sx; }
			if (e2 < dx){ err += dx; y0  += sy; }
	}
	return ( { 'x':x0, 'y':y0 } );
}
