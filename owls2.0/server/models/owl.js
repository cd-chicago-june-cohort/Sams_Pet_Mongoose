var mongoose = require('mongoose');

var OwlSchema = new mongoose.Schema({
    name: String,
    age: Number,
    spirit_person: String,
    prof_pic: String,
    added_at: Date
});

var Owl = mongoose.model('Owl', OwlSchema);
