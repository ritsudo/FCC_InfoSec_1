$(document).ready(function(){
	$("#output").hide();

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
		$("#output").show();
	});
});