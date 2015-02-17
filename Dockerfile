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