# Getting started with Fig and Express.js

Let's use Fig to set up and run a Expressjs/MongoDB app. Before starting, you'll need to have **Fig** installed.

Let's set up the **four** files that'll get us started. 

First, our app is going to be running inside a Docker container which contains all of its dependencies. We can define what goes inside that Docker container using a file called `Dockerfile`. It'll contain this to start with:

```
FROM dockerfile/nodejs

WORKDIR /data
# update to the latest
RUN apt-get install gcc make build-essential

# Add this to your Dockerfile, after your deps, but before your app code.
# The purpose of copy to /tmp folder firest is let docker cache the build result. 
# The second time all the step will be cached.

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /data/

```

That'll install our application inside an image with Nodejs installed alongside all of our Nodejs dependencies. For more information on how to write `Dockerfiles`, see the [Docker user guide](https://docs.docker.com/userguide/dockerimages/#building-an-image-from-a-dockerfile) and the [Dockerfile reference](http://docs.docker.com/reference/builder/).

Second, we define the dependencies in a file called `package.json`:

```
{
  "name": "fig-nodejs",
  "description": "Getting started with Fig and Nodejs",
  "version": "0.0.1",
  "author": "Guolin",
  "engines": {
    "node": "0.10.x",
    "npm": "1.4.x"
  },
  "dependencies": {
    "express": "~4.10.1",
    "mongoose": "~3.8.8"
  }
}
```

3rd, this is all tied together with a file called `fig.yml`. It describes the services that our app comprises of (a web server and database), what Docker images they use, how they link together, what volumes will be mounted inside the containers and what ports they expose.

```
db:
  image: dockerfile/mongodb
  command: mongod --smallfiles  # for fix this image's bug

web:
  build: .
  command: node app.js
  volumes:
    - ./app.js:/data/app.js
  ports:
    - "3000:3000"
  links:
    - db
  environment: 
   MONGO_URL: mongodb://db

```

See the [fig.yml reference](http://www.fig.sh/yml.html) for more information on how it works.

Finally, we need a file called 'app.js' to start the expressjs app and connect the mongodb.


```
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
```

OK, everything has been ready.

Then, run `fig up`:

```
Recreating myapp_db_1...
Recreating myapp_web_1...
Attaching to myapp_db_1, myapp_web_1
db_1  | 2015-02-17T07:16:16.363+0000 [initandlisten] waiting for connections on port 27017
...
web_1 | Example app listening at http://0.0.0.0:3000

```
In the background:
1. Fig will help you to build a new image with your `Dockerfile`. 
2. Fig create two container (web and db).
3. Run a command `node app.js` (configed in fig.yml) on the web container.

And now your Expressjs app should be running at port 3000 on your docker daemon (if you're using boot2docker, `boot2docker ip` will tell you its address).

DONE

* all the code will be donwload on https://github.com/guolin/fig-expressjs-examples*

*注：第一次写英文博客 :)*