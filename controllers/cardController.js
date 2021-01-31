var cards = require('../models/card');
let async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function(req, res) {
    // Display the total number of cards, cards per color, cards per cost, etc.
    async.parallel({
        creatureCards: (callback) => {
            cards.creatureCardModel.find({})
                .populate('baseCard')
                .exec(callback);
        },
        spellCards: (callback) => {
            cards.spellCardModel.find({})
                .populate('baseCard')
                .exec(callback);
        },
        artifactCards: (callback) => {
            cards.artifactCardModel.find({})
                .populate('baseCard')
                .exec(callback);
        }
    }, (err, result) => {
        if (err) {
            console.log(err.message);
        }
        let responseViewObject = {
            title: 'Card Inventory Home',
            error: err,
            data: result
        };
        console.log("data obtained:");
        console.log(result);
        res.render('index', responseViewObject);
    });
}

exports.cardList = function(req, res, next) {
    async.parallel({
        creatureCards: (callback) => {
            cards.creatureCardModel.find({}).populate('baseCard')
                .exec(callback);
        },
        spellCards: (callback) => {
            cards.spellCardModel.find({}).populate('baseCard').exec(callback);
        },
        artifactCards: (callback) => {
            cards.artifactCardModel.find({}).populate('baseCard')
                .exec(callback);
        }
    }, (err, result) => {
        if (err) {
            next(err, null);
            return;
        }
        
        let responseDataObject = {
            title: 'Card List',
            data: result
        };

        res.render('cardList', responseDataObject);
    });
}

exports.cardDetail = function(req, res, next) {
    console.log("params id");
    console.log(req.params.id);
    async.parallel({
        creatureCard: (callback) => {
            cards.creatureCardModel.findById(req.params.id)
                .populate('baseCard').exec(callback);
        },
        spellCard: (callback) => {
            cards.spellCardModel.findById(req.params.id).populate('baseCard')
                .exec(callback);
        },
        artifactCard: (callback) => {
            cards.artifactCardModel.findById(req.params.id).populate('baseCard')
                .exec(callback);
        }
    }, (err, result) => {
        if (err) {
            next(err, null);
            return;
        }

        let cardDetailObject = {
            title: 'Card Details.',
            data: result
        }
        res.render('cardDetail', cardDetailObject)
    });
}

exports.cardCreateCreatureGet = function(req, res, next) {
    let responseObject = {
        title: 'Fill this form to create a card',
        cardColorArray: cards.cardColorsArray,
        rarityArray: cards.rarityArray
    };

    res.render('cardCreateCreature', responseObject);
}

exports.creatureCardCreatePost = [
    (req, res, next) => {
        let requiredGemArray = req.body.requiredGems.toString().split(','); 
        req.body.requiredGems = requiredGemArray;
        next();
    },
    
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 })
    .escape(),
    body('color').escape(),
    body('requiredGems.*').optional({ checkFalsy: true }).escape(),
    body('manaCost', 'Mana cost must not be empty').isNumeric()
        .withMessage('Only numbers allowed as mana cost').escape(),
    body('rarity').escape(),
    body('strength').isNumeric().withMessage('Strength must be a number')
        .escape(),
    body('health').isNumeric().withMessage('Health must be a number')
        .escape(),
    body('Effects').optional({checkFalsy: true}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var baseCardObject = {
            color: req.body.color,
            requiredGems: req.body.requiredGems,
            manaCost: req.body.manaCost,
            name: req.body.name,
            rarity: req.body.rarity
        };

        var creatureCardObject = {
            baseCard: baseCardObject,
            strength: req.body.strength,
            health: req.body.health,
            effects: req.body.effects
        };

        if (!errors.isEmpty())
        {
            res.render('cardCreateCreature', {
                card: creatureCardObject,
                errors: errors.array(),
                cardColorArray: cards.cardColorsArray,
                rarityArray: cards.rarityArray
            });
            return;
        }
        else
        {
            // Create the base card
            async.series([
                (callback) => {
                    let newBaseCard = new cards.baseCardModel({
                        color: baseCardObject.color,
                        requiredGems: baseCardObject.requiredGems,
                        manaCost: baseCardObject.manaCost,
                        name: baseCardObject.name,
                        rarity: baseCardObject.rarity
                    });

                    newBaseCard.save((err) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }

                        callback(null, newBaseCard);
                    });
                }
            ],(err, result) => {
                if (err) {
                    next(err, null);
                    return;
                }

                let baseCard = result[0];
                creatureCardObject.baseCard = baseCard.id;
                let newCreatureCard = new cards
                    .creatureCardModel(creatureCardObject);
                
                newCreatureCard.save((err) => {
                    if (err) {
                        next(err, null);
                        return;
                    }

                    res.redirect(newCreatureCard.url);
                })
            });
        }
    }
];

// TODO(Wuhie): Implement a way to create spell and artifact cards

exports.cardDeleteGet = function(req, res, next) {
    async.parallel({
        creatureCard: (callback) => {
            cards.creatureCardModel.findById(req.params.id)
                .populate('baseCard').exec(callback);
        },
        spellCard: (callback) => {
            cards.spellCardModel.findById(req.params.id).populate('baseCard')
                .exec(callback);
        },
        artifactCard: (callback) => {
            cards.artifactCardModel.findById(req.params.id).populate('baseCard')
                .exec(callback);
        },
    }, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        res.render('cardDeleteGet', { title: 'Are you sure you want to delete\
            this card?', cards: result})
    })
}

exports.cardDeletePost = function(req, res) {
    async.parallel({
        creatureCard: (callback) => {
            cards.creatureCardModel.findByIdAndDelete(req.params.id)
                .exec(callback);
        },
        spellCard: (callback) => {
            cards.spellCardModel.findByIdAndDelete(req.params.id)
                .exec(callback);
        },
        artifactCard: (callback) => {
            cards.artifactCardModel.findByIdAndDelete(req.params.id)
                .exec(callback);
        },
    }, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect("/");
    })
}

exports.cardUpdateGet = function (req, res, next) {

}

exports.cardUpdatePost = function (req, res, next) {

}