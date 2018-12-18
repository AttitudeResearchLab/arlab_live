var GIFT = {
	"1": {
		cost: 10,
		frameNum: 4
	},

	"2": {
		cost: 50,
		frameNum: 21
	},

	"3": {
		cost: 20,
		frameNum: 8
	}
};

var money = Math.floor(Math.random() * 10) + 100;

function requestFullscreen(i) {
	if (i.requestFullscreen) {
		i.requestFullscreen();
	} else if (i.webkitRequestFullscreen) {
		i.webkitRequestFullscreen();
	} else if (i.mozRequestFullScreen) {
		i.mozRequestFullScreen();
	} else if (i.msRequestFullscreen) {
		i.msRequestFullscreen();
	}
}

function enterFullscreen() {
	var elem = document.getElementById("main");
	requestFullscreen(elem);
}

function loadGiftImgs(callback) {
	var res = {};
	var loadedIdx = 0;
	var loadedNum = 3;

	for (var i = 1; i <= loadedNum; i++) {
		var img = new Image();
		img.index = i;
		$(img).on('load', function() {
			res[this.index.toString()] = this;

			if (++loadedIdx == loadedNum) {
				callback(res);
			}
		});
		img.src = "res/gift" + i + ".png";
	}
}

function loadBarrage(index, callback) {
	$.ajax({
		url: "res/barrages" + index + ".json",
		dataType: "text",
		success: function(d) {
			callback(JSON.parse(d));
		}
	});
}

function showModal(opt) {
	$("#modal-window .modal-title").html(opt.title);
	$("#modal-window .modal-body").html(opt.content);
	$("#modal-window").modal("show");
}

$(document).ready(function() {
	var records = [];
	var user = "";
	var RECORD_API_URL = "http://" + window.location.hostname + ":5000/";


	$("#finish-basic-info").click(function(e) {
		e.preventDefault();

		var emailPrefix = $("#email-prefix").val().replace(/(^\s*)|(\s*$)/g, ""),
			id = $("#user-id").val().replace(/(^\s*)|(\s*$)/g, "");

		if (!emailPrefix.match(/^[a-z][a-z0-9]*$/ig) || emailPrefix.length == 0) {
			showModal({title: "Incorrect Email Prefix", content: "Email prefix should start with letters and end up with letters or numbers."})

			return;
		}

		if (id.length == 0) {
			showModal({title: "Incorrect Student ID", content: "Student ID should only consist of numbers."})

			return;
		}

		user = id + "_" + emailPrefix;

		$("#user-info-section").remove();
		$("#video-section").show();
		$("#video-section").css("display", "flex");

		showModal({title: "Money Received", content: "You have <b>" + money + " ARCs</b> to buy gifts. <small>(ARCs is short for ARLab Coins)</small>"})
	});

	/*************************************************************/
	/* Skip basic info */
	// $("#user-info-section").remove();
	// $("#video-section").show();
	// $("#video-section").css("display", "flex");
	/*************************************************************/


	function updateCurtainSize() {
		$("#main #curtain").css("width", $("#video-player").width());
		$("#main #curtain").css("height", $("#video-player").height());
	}

	$("#fullscreen-toggle").click(function() {
		enterFullscreen();
	});

	$("#video-player").on("ended", function() {
		updateCurtainSize();

		$("#main #curtain").css("visibility", "visible");
		$("#main #curtain").addClass("animated fadeIn");
		$("#video-player").removeAttr("controls");

		/** Upload record */
		$.ajax({
			url: RECORD_API_URL,
			method: "POST",
			crossDomain: true,
			dataType: "text",
			data: "data=" + encodeURIComponent(JSON.stringify(records)) + "&user=" + encodeURIComponent(user),
			success: function(d) {
				console.log(d);

				setTimeout(function() {
					alert("Finished! Thanks for your participation.");
				}, 3000);
			},
			error: function (msg) {
				console.log(msg);

				alert("Oops!! Something went wrong. Please contact the supervisor.")
			}
		});
	});

	loadGiftImgs(function(imgs) {
		loadBarrage(0, function(barrageList) {
			var b = new Barrage(barrageList, imgs, $("#video-player"), $("#barrage-canvas"));

			$(window).resize(function() {
				b.updateCanvasSize();

				updateCurtainSize();
			});

			function appendRecord(op, content) {
				records.push({
					time: b.video.currentTime,
					operation: op == 0 ? "send_text" : "send_gift",
					content: content
				});
			}

			function sendTextBarrage(){
				var content = $("#input-barrage").val().replace(/(^\s*)|(\s*$)/g, "");

				if (content.length != 0) {
					b.addTextBarrage(content);

					$("#input-barrage").val("");

					appendRecord(0, content);
				}
			}

			$("#send-barrage").click(function () {
				sendTextBarrage();
			});

			$("#input-barrage").keypress(function(event) {
				if (event.which == 13) {
					sendTextBarrage();
				}
			});

			$(".gift-btn").click(function () {
				var idx = $(this).attr("data-index");
				var gift = GIFT[idx];

				if (money < gift.cost) {
					showModal({title: "Money NOT Enough", content: "Only <b>" + money + " ARCs</b> left."});

					return;
				}

				money -= gift.cost;

				b.addGiftBarrage(idx);

				appendRecord(1, idx);
			});
		});
	});
});
