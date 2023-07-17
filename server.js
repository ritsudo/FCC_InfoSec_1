const express = require('express');
const https = require('https');
const crypto = require('crypto');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const port = 80;

//specify mongo URL as MyMongoUrl in appsettings.json

var rawdata = fs.readFileSync('appsettings.json');
var MDBUrl = JSON.parse(rawdata);
process.env.MONGO_URI = MDBUrl.MyMongoUrl;

app.use('/public', express.static(`${process.cwd()}/public`));

//MONGOOSE DB

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("# Connected to MongoDB sucessfully");
});

const likeSchema = new mongoose.Schema({
	name: {type: String, required:true },
	likedBy: {type: String, required:true }
});

const Like = mongoose.model("Like", likeSchema);

var createRecord = function(myName, myIp) {
	var myRecord = new Like({name: myName, likedBy: myIp});
	myRecord.save().then(result => {
		console.log(result);
	});
}

//END MONGOOSE DB

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

function getMyFile(url) {
		return myPromise = new Promise((resolve,reject) => {
		https.get(url,(res) => {
		var body = "";
		res.on("data", (chunk) => {
			body += chunk;
		});
		res.on("end", () => {
			try {
				var recvJson = JSON.parse(body);
				resolve(recvJson);
			} catch (error) {
				reject(error.message);
			};
		});
		}).on("error", (error) => {
			reject(error.message);
		});
	});
}

app.get('/api/jsonGet/:stockName', function (req, res) {
	var stockName = req.params.stockName;
	var url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+stockName+"/quote";
	var myJson = {
		name: 'not found',
		latest: 0
	};
	getMyFile(url)
			.then(response => {
					myJson.name=response.symbol;	
					myJson.latest=response.latestPrice;
					res.json(myJson);
			})
			.catch(error => {
				console.log(error);
			});
});

app.get('/api/setLike/:stockName', function(req, res) {
	
	var stockName = req.params.stockName;
	var reqIpAddr = req.socket.remoteAddress;
	var reqIpAddrHashed = crypto.createHash('md5').update(reqIpAddr).digest("hex");
	var salt = "aQgW4";
	var reqIpAddrHashedSalted = reqIpAddrHashed + salt;
	
	Like.findOne(
	{
		name: stockName,
		likedBy: reqIpAddrHashedSalted
		}
	)
		.then((docs)=>{
			if (!docs) {
				createRecord(stockName, reqIpAddrHashedSalted);
			}
			Like.countDocuments(
				{
				name: stockName
				})
				.then((docsResult)=>{
					res.json(
						{
						likeCount: docsResult
						});
				})
				.catch((err)=>{console.log(err)});
		})
		.catch((err)=>{
			console.log(err);
		});
  
});

app.listen(port, () => {
	console.log('Listening on http://localhost:'+port);
});