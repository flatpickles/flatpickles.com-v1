// Overlay text model

function CrimeText(text, x, y, rotation, size, blinking) {
	this.text = text;
	this.x = x;
	this.y = y;
	this.rotation = rotation;
	this.size = size;
	this.blinking = blinking;

	var visible = true;
	var visibilityToggle = setInterval(function() {
		this.visible = !this.visible || !this.blinking;
	}.bind(this), 150 + Math.random() * 250);
	
	this.draw = function(ctx) {
		if (!this.visible) { return; }
		
		ctx.font = "bold " + this.size.toString() + "pt Muli";
		ctx.fillStyle = "red";
		var widthOffset = ctx.measureText(this.text).width/2;
		
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.translate(-widthOffset, 0);
 		ctx.fillText(this.text, 0, 0);
		ctx.translate(widthOffset, 0);
		ctx.rotate(-this.rotation);
		ctx.translate(-this.x, -this.y);
	}.bind(this);
}

// Canvas setup helpers

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();

function updateCanvas(c) {
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var r = PIXEL_RATIO;
    c.width = w * r;
    c.height = h * r;
    c.getContext("2d").setTransform(r, 0, 0, r, 0, 0);
}

// Main drawing and event handling

var textIncrement = 2;
var rotationRange = 0.6;
var blinkProbability = 0.37;

var canvas;
var overlayTexts = []
var textSize = 40;

window.onload = function() {
	var credit = document.getElementById("credit");
	canvas = document.createElement("canvas");
	document.body.insertBefore(canvas, credit);
	canvas.id = "overlay";
	updateCanvas(canvas);
	window.requestAnimationFrame(draw);
}

window.onresize = function() {
	updateCanvas(canvas);
}

document.ontouchmove = function(event){
    event.preventDefault();
}

function createText(x, y) {
	playForTwitter();
	var rotation = Math.random() * rotationRange * 2 - rotationRange;
	var blinking = Math.random() < blinkProbability;
	var newText = new CrimeText("BIRDCRIME", x, y, rotation, textSize, blinking);
	overlayTexts.push(newText);
	textSize += textIncrement;
}

function playForTwitter() {
	// Twitter won't play videos inline, so video will be paused.
	// This is sub-optimal, but better than nothing :/
	var vidElement = document.getElementById("vid");
	if (vidElement.paused) {
		vidElement.play();
	}
}

var onClickCalled = false;
document.onclick = function(event) {
	if (onTouchStartCalled) return;
	onClickCalled = true;
	
	event.preventDefault();
	createText(event.clientX, event.clientY);
}

var onTouchStartCalled = false;
document.ontouchstart = function(event) {
	if (onClickCalled) return;
	onTouchStartCalled = true;
	
    event.preventDefault();
	createText(event.touches[0].clientX, event.touches[0].clientY);
}

function draw() {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	overlayTexts.forEach(function(crimeText, index, array) {
		crimeText.draw(ctx);
	});
	
	window.requestAnimationFrame(draw);
}