require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const routes = require('./routes/routes');
const app = express();
const port = 80;

app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("# Connected to MongoDB sucessfully");
});

routes(app);

app.listen(port, () => {
	console.log('Listening on http://localhost:'+port);
});