function Barrage(list, giftImgs, videoObj, canvasObj) {
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
	self.giftImgs = giftImgs;

	self.animationSpeed = 2;

	self.getArrivalTimes();

	self.played = false;

	self.videoSelector.on("play", function() {
		if (self.played) {
			return;
		}

		self.played = true;

		self.updateCanvasSize();

		$("#input-barrage").removeAttr("disabled");
		$(".gift-btn").removeAttr("disabled");

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

		self.arrivalTimes.sort(function(a, b) {
			return a < b;
		});
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
			var o = self.showingList[i];

			var removeFlag = false;

			if (o.type == "text") {
				o.x -= o.speed * self.canvasScale;

				if (o.x < -self.getTextWidth(o)) {
					removeFlag = true;
				} else {
					self.ctx.save();
					self.ctx.translate(o.x * self.canvasScale, o.y * self.canvasScale);
					self.ctx.textAlign = "left";
					self.ctx.textBaseline = "top";
					self.ctx.fillStyle = o.color;
					self.ctx.font = "bold " + (o.size * self.canvasScale) + "px Arial";
					self.ctx.fillText(o.content, 0, 0);
					self.ctx.restore();
				}
			} else if (o.type == "animation") {
				o.y -= o.speed * self.canvasScale;

				if (o.fadeDir == "in") {
					o.alpha += 0.01;

					if (o.alpha >= 1.2) {
						o.fadeDir = "out";
					}
				} else {
					o.alpha -= (o.speed / 2) * 0.01;
				}

				if (o.alpha >= 0) {
					self.ctx.save();
					self.ctx.globalAlpha = o.alpha;
					self.ctx.translate(o.x * self.canvasScale, o.y * self.canvasScale);
					self.ctx.drawImage(self.giftImgs[o.content], o.frameIdx * 90, 0, 90, 90, 0, 0, 90, 90);
					self.ctx.restore();

					if (o.animationSpeedIdx++ >= self.animationSpeed) {
						o.animationSpeedIdx = 0;

						if (++o.frameIdx >= GIFT[o.content].frameNum) {
							o.frameIdx = 0;
						}
					}
				} else {
					removeFlag = true;
				}
			}

			if (removeFlag) {
				self.showingList.splice(i--, 1);
				l--;
			}
		}

	},

	addTextBarrage: function(t) {
		var self = this;

		var textSize = Math.random() * 10 + 30;

		self.showingList.push({
			type: "text",
			content: t,
			size: textSize,
			x: self.initVideoWidth,
			y: Math.random() * (self.initVideoHeight - textSize * 2),
			speed: 3 + Math.random() * 3,
			color: self.getRandomColor()
		});
	},

	addGiftBarrage: function(i) {
		var self = this;

		self.showingList.push({
			type: "animation",
			content: i,
			frameIdx: 0,
			x: 30,
			y: self.initVideoHeight,
			alpha: 0,
			animationSpeedIdx: 0,
			fadeDir: "in",
			speed: 2 + Math.random() * 3
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
					var content = newBarrages[i];

					if (content.startsWith("@gift:")) {
						self.addGiftBarrage(content.slice(6));
					} else {
						self.addTextBarrage(content);
					}
				}
			}
		}

		window.requestAnimationFrame(function() { self.mainLoop() });
	}
};
