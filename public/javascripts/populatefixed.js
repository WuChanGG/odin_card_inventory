#! /usr/bin/env node

let mongoose = require('mongoose');
let async = require('async');
let cards = require('../../models/card');

let main = () => {
    console.log('This script populates a database');
    connectToDatabase();
}

main();

function connectToDatabase() {

    let mongoDB = 'mongodb://bflabs:F3B04cgVBT6fmOLr@cluster0-shard-00-00.v2b88\
        .mongodb.net:27017,cluster0-shard-00-01.v2b88.mongodb.net:27017,cluster\
        0-shard-00-02.v2b88.mongodb.net:27017/card_inventory?ssl=true&replica\
        Set=atlas-14nkr5-shard-0&authSource=admin&retryWrites=true&w=majority'; 

    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology:
        true}).then(() => {
            console.log('Connected to database');
        });

    mongoose.Promise = global.Promise;

    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error: '));
}