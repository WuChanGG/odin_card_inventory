let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let cardColorsArray = ['Red', 'Purple', 'Yellow', 'Green', 'Blue', 'Orange'];

module.exports.cardColorsArray = cardColorsArray;

let rarityArray = ['Common', 'Uncommon', 'Rare', 'Mythic'];

exports.rarityArray = rarityArray;

let baseCardSchema = new Schema({
    // The color that the card will give when burnt
    color: { type: String, required: true, minlength: 1 },
    requiredGems: [{ type: String, enum: cardColorsArray }],
    manaCost: { type: Number, required: true },
    name: { type: String, required: true, minlength: 1 },
    // From the rarity we can get the crafting cost (price)
    rarity: { type: String, enum: rarityArray, required: true },
});

module.exports.baseCardModel = mongoose.model('baseCard', baseCardSchema);

let creatureCardSchema = new Schema({
    baseCard: { type: Schema.Types.ObjectId, ref: 'baseCard', required: true },
    strength: { type: Number, required: true, min: 0},
    health: { type: Number, required: true, min: 1 },
    effects: { type: String }
});

let spellCardSchema = new Schema({
    baseCard: { type: Schema.Types.ObjectId, ref: 'baseCard', required: true },
    effects: { type: String }
});

let artifactCardSchema = new Schema({
    baseCard: { type: Schema.Types.ObjectId, ref: 'baseCard', required: true },
    effects: { type: String },
    energy: { type: Number },
});

artifactCardSchema.virtual('url').get(function() {
    console.log('Id from url virtual');
    console.log(this._id);
    return '/inventory/card/' + this.id;
});

spellCardSchema.virtual('url').get(function() {
    console.log('Id from url virtual');
    console.log(this._id);
    return '/inventory/card/' + this.id;
});

creatureCardSchema.virtual('url').get(function() {
    console.log('Id from url virtual');
    console.log(this._id);
    return '/inventory/card/' + this.id;
});

creatureCardSchema.virtual('deleteUrl').get(function() {
    console.log('Id from url virtual');
    console.log(this._id);
    return '/inventory/card/delete/' + this.id;
});

exports.creatureCardModel = mongoose.model('creatureCard', creatureCardSchema);

module.exports.spellCardModel = mongoose.model('spellCard', spellCardSchema);

module.exports.artifactCardModel = mongoose.model('artifactCard', artifactCardSchema);