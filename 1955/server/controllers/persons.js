var mongoose = require('mongoose');
var Person = mongoose.model('Person');

module.exports = {

    show: function(req,res) {
        Person.find({}, function(err, persons) {
            if (err) {
                console.log("There was an error loading all persons.");
            } else {
                res.json(persons);
            }
        });
    },

    create: function(req,res){
        var newPerson = new Person();
        newPerson.name = req.params.name;
        newPerson.save(function (err){
            if(err) {
                console.log("There was an error adding your person.");
            } else {
                res.redirect('/');
            }
        });
    },

    show_one: function(req,res){
        Person.findOne({name: req.params.name}, function(err, person) {
            if (err) {
                console.log("There was an error loading all persons.");
            } else {
                res.json(person);
            }
        });
    },

    destroy: function(req,res){
        Person.remove({name: req.params.name}, function(err){
            if (err) {
                console.log("There was an error in deleting this person.");
                res.redirect('/');
            } else {
                res.redirect('/');
            }
        });
    }
}