var express = require('express'),
    mongoose = require('mongoose');

var app = express(),
	connected = true;



// Test the mongodb connect is ok
mongoose.connect(process.env.MONGO_URL , function(err) {
	if (err) {
		connected = false;
		console.log('Could not connect to MongoDB!');
		console.log(err);
	}
});

// Test the web server
app.get('/', function (req, res) {
	if (connected) {
		res.send('MongoDB has been connected.');
	} else {
		res.send('Could not connect to MongoDB!');
	}
});

var server = app.listen(3000, function () {

    var host = server.address().address,
        port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

});