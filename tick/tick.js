#!/usr/bin/env node

//
// A very simple data source that adds a timestamp to the logger queue
//

// default interval (in milliseconds)
let interval = 60000;
let debugMe = false;

let getopt = require('node-getopt');

let Getopt = new getopt([
    ['i', 'interval=', 'tick interval in seconds'],
    ['d', 'debug', 'debug output'],
    ['h', 'help', 'display this help']
]);

Getopt.setHelp(
    "\nusage: tick.js [OPTION]\n" +
    "[[OPTIONS]]\n"
);

Getopt.bindHelp();

let args = Getopt.parse(process.argv.slice(2));

if (args.options.interval) {
    interval = args.options.interval * 1000;
}
console.log('interval ' + interval);

if (args.options.debug) {
    debugMe = true;
}

let redis = require("redis");
let client = redis.createClient();
let ts = 0;

function tick() {
    ts = new Date();

    let msg = {
        timestamp: ts.valueOf(),
        device: 'tick',
        deviceId: 'localhost',
        messageType: 'tick',
        data: ts.toISOString()
    };

    let msgString = JSON.stringify(msg);

    if (debugMe) {
        console.log(msg.data);
    }
    client.publish("TestFeed.localhost", msgString);

    setTimeout(tick, interval);
}

setTimeout(tick, 10);
