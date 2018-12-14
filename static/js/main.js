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

function loadBarrage(index, callback) {
	$.ajax({
		url: "res/barrages" + index + ".json",
		dataType: "text",
		success: function(d) {
			callback(JSON.parse(d));
		}
	});
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
			alert("Incorrect email prefix!");

			return;
		}

		if (id.length == 0) {
			alert("Incorrect student ID!");

			return;
		}

		user = id + "_" + emailPrefix;

		$("#user-info-section").remove();
		$("#video-section").show();
		$("#video-section").css("display", "flex");
	});


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
			data: "data=" + JSON.stringify(records) + "&user=" + user,
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

	loadBarrage(0, function(barrageList) {
		var b = new Barrage(barrageList, $("#video-player"), $("#barrage-canvas"));

		$(window).resize(function() {
			b.updateCanvasSize();

			updateCurtainSize();
		});

		function sendBarrage(){
			var content = $("#input-barrage").val().replace(/(^\s*)|(\s*$)/g, "");

			if (content.length != 0) {
				b.addBarrage(content);

				$("#input-barrage").val("");

				records.push({
					time: b.video.currentTime,
					operation: "send_barrage",
					content: content
				});
			}
		}

		$("#send-barrage").click(function () {
			sendBarrage();
		});

		$("#input-barrage").keypress(function(event) {
			if (event.which == 13) {
				sendBarrage();
			}
		});
	});
});
