/**
 * Created by dave on 12/17/16.
 */

'use strict';

// get redis connection set up

let redis = require("redis");
// var redisClient = redis.createClient();
//
// redisClient.on('error', function (err) {
//     console.log("redis error: " + err);
// });
//
// redisClient.on('connect', function () {
//     console.log('redis connected');
//     redisClient.psubscribe('DcsFeed.*');
// });

// =================

const Hapi = require('hapi');
const Good = require('good');
const Susie = require('susie');

const server = new Hapi.Server();
server.connection({port: 8080});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("Nothing useful here");
    }
});

// ################################################################################

server.route({
    method: 'GET',
    path: '/feed',
    handler: function (request, reply) {
        //console.dir(request.connection);
        console.log("client connect");

        let redisClient = redis.createClient();

        redisClient.on('error', function (err) {
            console.log("redis error: " + err);
        });

        redisClient.on('connect', function () {
            redisClient.psubscribe('TestFeed.*');
        });

        // received a message from the feed channel
        redisClient.on("pmessage", function (pattern, channel, message) {

            // console.dir(message);
            reply.event(JSON.parse(message));
        });

        request.on("disconnect", function () {
            console.log("client disconnect");
            redisClient.quit();
        });
    }
});

// ################################################################################

server.register({
    register: Susie,
    options: {}

}, (err) => {
    if (err) {
        throw err;
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

