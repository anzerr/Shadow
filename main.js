
window.onload = function() {
	var canvas = document.getElementById('main');
	var context = canvas.getContext('2d');
		canvas.height = 800;
		canvas.width = 800;
		canvas.style.backgroundColor = "black";
		
		var box = [];
		function _box( x, y, w, h, color ) {
			context.fillStyle = color;
			context.fillRect( x, y, w, h );
			box[ box.length ] = {
				'x':x, 'y':y, 'w':w, 'h':h
			}
		}
		
	for ( var i = 0; i<5+Math.round( Math.random()*15 ); i++ ) {
		_box( 50+Math.round( Math.random()*600 ), 50+Math.round( Math.random()*600 ), 10+Math.round( Math.random()*90 ), 10+Math.round( Math.random()*90 ), "blue" );
	}
	
	var mousex = 400, mousey = 400;
	canvas.onmousemove = function(e) {
		mousex = e.pageX;
		mousey = e.pageY;
	}
	
	var render = function() {
		var vector = [], time = (new Date().getTime());
		context.clearRect( 0, 0, canvas.width, canvas.height );
		for (var i in box) {
			context.fillStyle="blue";
			context.fillRect( box[i].x, box[i].y, box[i].w, box[i].h );
			var add = {
				0:{ 'x':box[i].x, 'y':box[i].y }, 
				1:{ 'x':box[i].x+box[i].w, 'y':box[i].y },
				2:{ 'x':box[i].x+box[i].w, 'y':box[i].y+box[i].h }, 
				3:{ 'x':box[i].x, 'y':box[i].y+box[i].h }
			};

			for (var v in add) {
				for (var x in add) {
					if ( distance( mousex, mousey, add[x].x, add[x].y ) < distance( mousex, mousey, add[v].x, add[v].y ) ) {
						var tmp = add[x];
						add[x] = add[v];
						add[v] = tmp;
					}
				}
			}
			
			for (var v in add) {
				if ( v != 0 ) vector[ vector.length ] = add[v];
			}
		}
		
		vector[ vector.length ] = { 'x':40, 'y':40 };
		vector[ vector.length ] = { 'x':40, 'y':760 };
		vector[ vector.length ] = { 'x':760, 'y':40 };
		vector[ vector.length ] = { 'x':760, 'y':760 };
		for (var i in vector) {
			for (var v in vector) {
				if (angle( mousex, mousey, vector[i].x, vector[i].y ) < angle( mousex, mousey, vector[v].x, vector[v].y ) ) {
					var tmp = vector[i];
					vector[i] = vector[v];
					vector[v] = tmp;
				}
			}
		}
		vector[ vector.length ] = vector[0];
		
		var ray = new rayTrace( canvas );
		var last = false;
		for (var i in vector) {
			var cur = ray.run( mousex, mousey, vector[i].x, vector[i].y );
			
			if (last != false) {
				context.globalAlpha = 0.5;
				context.beginPath();
					context.moveTo( mousex, mousey );
					context.lineTo( last.x, last.y );
					context.lineTo( cur.x, cur.y );
					context.fillStyle = "red";
				context.closePath();
				context.fill();
				context.globalAlpha = 1;
			}
			last = cur;
			context.font = '10pt Calibri';
			context.fillStyle = 'yellow';
			context.fillText( (parseInt(i)+1), vector[i].x, vector[i].y );
		}
		
		context.font = '10pt Calibri';
		context.fillStyle = 'pink';
		context.fillText( Math.round((new Date().getTime())-time)+" "+Math.round(1000/30), 10, 10 );
	}
	
	window.requestAnimFrame = (function(callback) {
		return 	(
			window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000 / 30); }
		);
	})();

	var animate = function() {
		render();
		requestAnimFrame(function() {
			animate();
		});
	};
	animate();
}