const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    name: String,
    genre: String,
    artistId: String,
    kudos: Number
});

module.exports = mongoose.model('Song', songSchema);
