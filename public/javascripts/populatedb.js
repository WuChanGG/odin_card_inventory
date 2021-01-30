#! /usr/bin/env node

let cards = require('../../models/card');
let category = require('../../models/category');
let mongoose = require('mongoose');
let async = require('async');

function connectToDatabase() {
    // wrong credentials
  let dev_db_url = 'mongodb://bflabs:F3B04cgVBT6fmOLr@cluster0-shard-00-00.v2b88.mongodb.net:27017,cluster0-shard-00-01.v2b88.mongodb.net:27017,cluster0-shard-00-02.v2b88.mongodb.net:27017/card_inventory?ssl=true&replicaSet=atlas-14nkr5-shard-0&authSource=admin&retryWrites=true&w=majority';
//   let dev_db_url = 'mongodb://bflabs:F3B04cgVBT6fmOLr@cluster0-shard-00-00.v2b88.mongodb.net:27017,cluster0-shard-00-01.v2b88.mongodb.net:27017,cluster0-shard-00-02.v2b88.mongodb.net:27017/card_inventory?ssl=true&replicaSet=atlas-14nkr5-shard-0&authSource=admin&retryWrites=true&w=majority';
  let mongoDB = process.env.MONGODB_URI || dev_db_url;
  mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    // generateBaseCards();
    mainGenerateMonsterCards();
  });

  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

let generateBaseCard = (color, requiredGems, manaCost, name, rarity, cb) => {
    let baseCardObject = { color: color, requiredGems: requiredGems
        , manaCost: manaCost, name: name, rarity: rarity };
    let baseCardModel = new cards.baseCardModel(baseCardObject);

    baseCardModel.save((err) => {
        if (err) {
            console.log('base card addition failed');
            cb(err, null);
            return;
        }

        console.log('New base card: ' + baseCardModel);
        cb(null, baseCardModel);
    });
};

let generateMonsterCard = (color, requiredGems, manaCost, name, rarity
    , strength, health, effects, cb) => {
        // first create the base card
        async.parallel({
            generatedBaseCard: function(callback) {
                generateBaseCard(color, requiredGems, manaCost, name, rarity, callback);
            }
        }, (err, result) => {
            if (err) {
                cb(err, null);
                return;
            }

            // Create the creature card
            let creatureCardObject = {
                strength, health, effects, baseCard: 
                    result.generatedBaseCard._id
            };

            let newCreatureCard = new cards.creatureCardModel(
                creatureCardObject);
                
            newCreatureCard.save((err) => {
                if (err) {
                    cb(err, null);
                    return;
                }

                console.log('New monster card' + newCreatureCard);
                cb(null, newCreatureCard);
            });
        })
};

let generateSpellCard = (color, requiredGems, manaCost, name, rarity
    , effects, cb) => {
        // first create the base card
        async.parallel({
            generatedBaseCard: function(callback) {
                generateBaseCard(color, requiredGems, manaCost, name, rarity, callback);
            }
        }, (err, result) => {
            if (err) {
                cb(err, null);
                return;
            }

            // Create the creature card
            let spellCardObject = {
                effects, baseCard: result.generatedBaseCard._id
            };

            let newSpellCard = new cards.spellCardModel(
                spellCardObject);
                
            newSpellCard.save((err) => {
                if (err) {
                    cb(err, null);
                    return;
                }

                console.log('New monster card' + newSpellCard);
                cb(null, newSpellCard);
            });
        })
};

let createMonsterCards = (cb) => {
    console.log('creating monster cards');
    async.series([
        (callback) => {
            generateMonsterCard('Red', ['Red', 'Red', 'Blue'], 1, 'Fanged Spider'
                , 'Common', 9, 9, 'Deadly', callback);
        },
        (callback) => {
            generateMonsterCard('Blue', ['Blue', 'Blue', 'Blue'], 1
                , 'Desert Wolf', 'Common', 9, 9, 'Deadly', callback);
        },
    ], (err, result) => {
        if (err) {
            cb(err, null);
        }
        else {
            console.log('created monster cards');
        }
    });
};

let createSpellCards = (cb) => {
    async.series([
        (callback) => {
            generateSpellCard('Red', ['Red', 'Blue'], 7, 'Polar Destruction',
                'Uncommon', 'Destroys an enemy creature.', callback);
        },
        (callback) => {
            generateSpellCard('Purple', ['Red', 'Blue'], 7, 'Sun Card',
                'Uncommon', 'Reveals the oponent\'s hand.', callback);
        },
    ], (err, result) => {
        if (err) {
            cb(err, null);
            return;
        }
        else {
            console.log('created spell cards')
        }
    });
}

// MAIN here
connectToDatabase();
console.log('connected to database');

function generateBaseCards(cb) {
    async.series([   
        (callback) => {
            generateBaseCard('Red', ['Red', 'Red', 'Blue'], 1, 'Fanged Spider'
                , 'Common', callback);
        }
    ], (err, result) => {
        if (err) {
            cb(err, null);
        }
        else {
            console.log('created monster cards');
        }
    });
}

function mainGenerateMonsterCards() {
    async.series([
        // generateBaseCards,
        //createMonsterCards,
        createSpellCards,
    ],
        (err, results) => {
            if (err) {
                console.log('Final Error: ' + err);
            }
            else {
                console.log("Database was populated successfuly");
            }

            mongoose.connection.close();
        });
}