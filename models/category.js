let mongoose = require('mongoose');
let cardModule = require('./card');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: { type: String, enum: cardModule.cardColorsArray, required: true},
    description: { type: String, required: true, minlength: 1},
});

categorySchema.virtual('url').get(() => {
    return '/inventory/category/' + this._id;
});

let categoryModel = mongoose.model('category', categorySchema);