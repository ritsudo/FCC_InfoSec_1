const express = require('express');
const https = require('https');
const app = express();
const port = 80;


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API env test

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
  res.json(
  { 
	likeCount: '000',
	lastLiked: 'no'
  });
});
// End first API endpoint

app.listen(port, () => {
	console.log('Listening on http://localhost:$(port)');
});