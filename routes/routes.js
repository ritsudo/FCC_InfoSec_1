const https = require('https');
const crypto = require('crypto');

module.exports = function(app) {
	
const Like = require('../models/like');
	
var createRecord = function(myName, myIp) {
	var myRecord = new Like({name: myName, likedBy: myIp});
	myRecord.save().then(result => {
		console.log(result);
	});
}	
	
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

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

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
	
}