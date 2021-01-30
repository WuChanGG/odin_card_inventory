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
            cards.creatureCardModel.findById(req.params.id).populate('baseCard')
                .exec(callback);
        },
        artifactCard: (callback) => {
            cards.creatureCardModel.findById(req.params.id).populate('baseCard')
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

exports.cardCreateGet = function(req, res, next) {

}

exports.cardCreatePost = [

];

exports.cardDeleteGet = function(req, res, next) {

}

exports.cardDeletePost = function(req, res) {

}

exports.cardUpdateGet = function (req, res, next) {

}

exports.cardUpdatePost = function (req, res, next) {

}