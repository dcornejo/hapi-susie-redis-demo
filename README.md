# Hapi.js, Susie, and Redis Demo

An amateur attempt to use Hapi.js and susie to stream messages from redis 
to a client using Server Sent Events.

The subdirectory tick contains a very simple data source for this demo.

To run, first start tick, then start server.

connect to the server using a URL something like this:

http://localhost:8080/feed

And you should start to see tick messages.
