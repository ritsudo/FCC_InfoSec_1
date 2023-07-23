const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
	name: {
		type: String,
		required:true 
		},
	likedBy: {
		type: String,
		required:true 
		}
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;