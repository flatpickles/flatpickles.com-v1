// global vars

var positions = [[[.15, 1], [.15, .75], [.15, .5], [.15, .25], [.15, 0], [.325, .2], [.5, .4], [.675, .2], [.85, 0], [.85, .25], [.85, .5], [.85, .75], [.85, 1]], [[.15, 1], [.2375, 0.75], [0.325, 0.5], [.4125, .25], [0.5, 0], [0.5, 0.6], [.5875, 0.25], [0.675, 0.5], [.7625, 0.75], [0.85, 1]], [[.15, 1], [.15, .75], [.15, .5], [.15, .25], [.15, 0], [.29, .2], [.43, .4], [.57, .6], [.71, .8], [.85, 0], [.85, .25], [.85, .5], [.85, .75], [.85, 1]], [[.15, 1], [.325, 1], [.5, 1], [.5, .75], [.5, .5], [.5, .25], [.5, 0], [.35, .15], [.2, .3], [.675, 1], [.86, 1]]];
var scale_factor = $(window).width() / (positions.length + 1);
var x_inset = scale_factor / 2;
var y_inset = $(window).height() / 2 - scale_factor / 2;
var shape_size = $(window).width() / 35;

// helper functions

function pos_x(letter_index, shape_index) {
	return scale_factor * positions[letter_index][shape_index][0] + x_inset + letter_index * scale_factor + jitter();
};

function pos_y(letter_index, shape_index) {
	return scale_factor * positions[letter_index][shape_index][1] + y_inset + jitter();
};

function vx() {
	return (Math.random() * 0.1 - 0.05) * (shape_size / 50);
};

function vy() {
	return (Math.random() * -0.2 - 0.2) * (shape_size / 50);
};

function jitter() {
	return Math.random() * 1 - 0.5;
};

function randomColor(fix) {
    var letters = '0123456789ABCD'.split('');
    var color = "";
    switch(fix) {
	    case 0:
		    color = '#';
		    letters.push('E', 'F');
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * (letters.length))];
		    }
	    	break;
	    case 1:
		    color = '#DD';
		    for (var i = 0; i < 4; i++ ) {
		        color += letters[Math.floor(Math.random() * (letters.length))];
		    }
	    	break;
	    case 2:
		    color = '#';
	        color += letters[Math.floor(Math.random() * (letters.length))];
	        color += letters[Math.floor(Math.random() * (letters.length))];
	        color += 'DD';
	        color += letters[Math.floor(Math.random() * (letters.length))];
	        color += letters[Math.floor(Math.random() * (letters.length))];
	    	break;
	    case 3:
		    color = '#';
	    	for (var i = 0; i < 4; i++ ) {
		        color += letters[Math.floor(Math.random() * (letters.length))];
		    }
		    color += 'DD';
	    	break;
    }
    return color;
};

// physics!!

$(document).ready(function() {
	var viewWidth = $(window).width();
	var viewHeight = $(window).height();

	// widen the canvas
	$('#viewport').height(viewHeight);
	$('#viewport').width(viewWidth);

	// render some physics
	Physics({
		timestep: 1000.0 / 160,
		maxIPF: 8,
		integrator: 'verlet'
	}, function(world) {
		var renderer = Physics.renderer('canvas', {
			el: 'viewport',
			width: viewWidth,
			height: viewHeight,
			meta: false,
		});
		world.add(renderer);
		world.on('step', function() {
			world.render();
		});

		var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
		world.add(Physics.behavior('edge-collision-detection', {
			aabb: viewportBounds,
			restitution: 0.8,
			cof: 0.2
		}));

		// M
		var vx_M = vx();
		var vy_M = vy();
		for (var i = 0; i < positions[0].length; i++) {
			var factor = 300.0;
			var x_offset = 50;
			var y_offset = 50;
			world.add(
				Physics.body('circle', {
					x: pos_x(0, i),
					y: pos_y(0, i),
					vx: vx_M,
					vy: vy_M,
					radius: shape_size/2,
					styles: { fillStyle: randomColor(3) }
				})
			);
		}

		// A
		var vx_A = vx();
		var vy_A = vy();
		for (var i = 0; i < positions[1].length; i++) {
			var factor = 300.0;
			var x_offset = 350;
			var y_offset = 50;
			world.add(
				Physics.body('rectangle', {
					x: pos_x(1, i),
					y: pos_y(1, i),
					vx: vx_A,
					vy: vy_A,
					width: shape_size,
					height: shape_size,
					styles: { fillStyle: randomColor(1) }
				})
			);
		}

		// N
		var vx_N = vx();
		var vy_N = vy();
		for (var i = 0; i < positions[2].length; i++) {
			var factor = 300.0;
			var x_offset = 650;
			var y_offset = 50;
			world.add(
				Physics.body('circle', {
					x: pos_x(2, i),
					y: pos_y(2, i),
					vx: vx_N,
					vy: vy_N,
					radius: shape_size/2,
					styles: { fillStyle: randomColor(2) }
				})
			);
		}

		// 1
		var vx_1 = vx();
		var vy_1 = vy();
		for (var i = 0; i < positions[3].length; i++) {
			var factor = 300.0;
			var x_offset = 950;
			var y_offset = 50;
			world.add(
				Physics.body('rectangle', {
					x: pos_x(3, i),
					y: pos_y(3, i),
					vx: vx_1,
					vy: vy_1,
					width: shape_size,
					height: shape_size,
					styles: { fillStyle: randomColor(0) }
				})
			);
		}

		var beh = Physics.behavior('interactive', {
				el: renderer.el,
				maxVel: {
					x: 0,
					y: 0
				},
				minVel: {
					x: 0,
					y: 0
				},
			})

		world.add([
			beh,
			Physics.behavior('body-collision-detection'),
			Physics.behavior('body-impulse-response'),
			Physics.behavior('constant-acceleration'),
			Physics.behavior('sweep-prune')
		]);

		var attractor = Physics.behavior('attractor', {
			order: 0,
			strength: 0.001
		});
		world.on({
			'interact:poke': function(pos) {
				attractor.position(pos);
				world.add(attractor);
			},
			'interact:move': function(pos){
				if (world.has(attractor)) {
					attractor.position(pos);
				}
			},
			'interact:release': function(pos) {
				var body = world.findOne(function(b) {
					return Physics.aabb.contains(b.aabb(), pos);
				})

				if (body && body.radius == shape_size) {
					window.location.assign("http://t.co/man1");
				} else if (body) {
					return;
				} else if (world.has(attractor)) {
					world.remove(attractor);
				}
			}
		});

		Physics.util.ticker.on(function(time, dt) {
			world.step(time);
		});
		Physics.util.ticker.start();
	});
});