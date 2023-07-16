$(document).ready(function(){
	$("#output").hide();
	$("#like_value").hide();
	$("#likedBy").hide();

	$("#submit_btn").click(function(){
		//API REQUEST CODE HERE
		var reqUrl = "api/jsonGet/" + $("#stockName").val();
		$.getJSON(reqUrl, function (result) {
			$("#out_name").text(result.name);
			$("#out_value").text(result.latest);
			$("#output").show();
		});
	});
	
	$("#like_btn").click(function(){
		//LIKE REQUEST CODE HERE
		var reqLikeUrl = "api/setLike/" + $("#stockName").val();
		$.getJSON(reqLikeUrl, function (result) {
			$("#like_value").text(result.likeCount);
			$("#like_heart").attr("style", "color: red;");
			$("#likedBy").show();
			$("#like_value").show();
		});

	});
});