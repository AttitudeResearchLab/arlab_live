var BARRAGE_COLOR_LIST = ["yellow", "red", "orangered", "purple", "green", "blue", "lightblue"];

function Barrage(list, videoObj, canvasObj) {
	var self = this;
	
	self.barrageList = list;
	self.isPause = true;
	self.showingList = [];
	self.videoSelector = videoObj;
	self.canvasSelector = canvasObj;
	self.video = videoObj.get(0);
	self.canvas = canvasObj.get(0);
	self.ctx = self.canvas.getContext("2d");
	self.arrivalTimes = [];
	self.canvasScale = 0;
	self.scaleY = 0;
	self.initVideoWidth = 0;
	self.initVideoHeight = 0;

	self.getArrivalTimes();

	self.videoSelector.on("loadeddata", function() {
		self.updateCanvasSize();

		window.requestAnimationFrame(function() { self.mainLoop() });
	});
}

Barrage.prototype = {
	getRandomColor: function() {
		var rgb = [];

		for (var i = 0; i < 3; ++i) {
			var color = Math.floor(Math.random() * 256).toString(16);
			color = color.length == 1 ? "0" + color : color;
			rgb.push(color);
		}

		return "#" + rgb.join("");
	},

	getArrivalTimes: function() {
		var self = this;

		for (var k in self.barrageList) {
			self.arrivalTimes.push(parseFloat(k));
		}

		self.arrivalTimes.sort();
	},

	updateCanvasSize: function() {
		var w = this.videoSelector.width(),
			h = this.videoSelector.height();

		if (this.canvasScale == 0) {
			this.canvasScale = 1;
			this.initVideoWidth = w;
			this.initVideoHeight = h;
		} else {
			this.canvasScale = w / this.initVideoWidth;
		}

		this.canvasSelector.attr("width", w);
		this.canvasSelector.attr("height", h);
	},

	getTextWidth: function(txt) {
		this.ctx.save();
		this.ctx.font = "bold " + (txt.size * this.canvasScale) + "px Arial";

		var w = this.ctx.measureText(txt.content).width;

		this.ctx.restore();

		return w;
	},

	renderBarrage: function() {
		var self = this;

		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

		for (var i = 0, l = self.showingList.length; i < l; i++) {
			var txt = self.showingList[i];

			txt.x -= txt.speed;

			if (txt.x < -self.getTextWidth(txt)) {
				self.showingList.splice(i--, 1);
				l--;
			} else {
				self.ctx.save();
				self.ctx.translate(txt.x * self.canvasScale, txt.y * self.canvasScale);
				self.ctx.textAlign = "left";
				self.ctx.textBaseline = "top";
				self.ctx.fillStyle = txt.color;
				self.ctx.font = "bold " + (txt.size * self.canvasScale) + "px Arial";
				self.ctx.fillText(txt.content, 0, 0);
				self.ctx.restore();
			}
		}

	},

	addBarrage: function(t) {
		var self = this;

		var textSize = Math.random() * 10 + 30;

		self.showingList.push({
			content: t,
			size: textSize,
			x: self.initVideoWidth,
			y: Math.random() * (self.initVideoHeight - textSize * 2),
			speed: 3 + Math.random() * 5,
			color: self.getRandomColor()
		});
	},

	mainLoop: function() {
		var self = this;

		if (!self.video.paused) {
			self.renderBarrage();

			if(self.video.currentTime > self.arrivalTimes[0]) {
				var t = self.arrivalTimes.shift();
				var newBarrages = self.barrageList[t.toString()];

				for (var i = 0; i < newBarrages.length; i++) {
					self.addBarrage(newBarrages[i]);
				}
			}
		}

		window.requestAnimationFrame(function() { self.mainLoop() });
	}
};
