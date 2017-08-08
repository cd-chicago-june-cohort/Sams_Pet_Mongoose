var express = require("express");
var app = express();
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/owl_data');

var OwlSchema = new mongoose.Schema({
    name: String,
    age: Number,
    spirit_person: String,
    prof_pic: String,
    added_at: Date
});
mongoose.model('Owl', OwlSchema);
var Owl = mongoose.model('Owl')


app.get('/', function(req, res) {
    Owl.find({}, function(err, owls){
        if(err) {
            console.log("There is an error with your owls!");
            res.render("index", {owls : []});
        } else {
            res.render("index", {owls: owls});
        }
    });
});

app.get('/owls/new', function(req, res){
    res.render("new");
});

app.post('/owls', function(req,res){
    var img_num = Math.floor((Math.random() * 4) + 1);
    var img_str = "owl" + img_num + ".jpg"
    var myDate = new Date();
    var newOwl = new Owl();
    newOwl.name = req.body.name;
    newOwl.age = req.body.age;
    newOwl.spirit_person = req.body.spirit;
    newOwl.added_at = myDate;
    newOwl.prof_pic = img_str;
    newOwl.save(function(err){
        if (err) {
            console.log("Uh oh! Your new Owl has an error!");
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/owls/:id', function(req,res){
    Owl.find({_id: req.params.id}, function(err, owls){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            var myOwl = owls[0]
            res.render("info", {owl : myOwl});
        }
    });
});

app.get('/owls/edit/:id', function(req, res){
    Owl.find({_id: req.params.id}, function(err, owls){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            var myOwl = owls[0]
            res.render("edit", {owl : myOwl});
        }
    });
});

app.post('/owls/process/:id', function(req,res){
    Owl.find({_id: req.params.id}, function(err, owls){
        var updated_age = 0;
        var updated_name = "";
        var updated_spirit = "";
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            var myOwl = owls[0]
            if (req.body.name.length != 0) {
                updated_name = req.body.name;
            } else {
                updated_name = myOwl.name;
            };

            if (req.body.age) {
                updated_age = req.body.age;
            } else {
                updated_age = myOwl.age;
            }

            if (req.body.spirit.length != 0) {
                updated_spirit = req.body.spirit;
            } else {
                updated_spirit = myOwl.spirit_person;
            }
        
            Owl.update({_id: req.params.id}, {$set: {name: updated_name, age: updated_age,  spirit_person: updated_spirit}}, function(err, owls){
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    res.redirect("/owls/:id");
                }
            });
        }
    });
});

app.get('/destroy/:id', function(req,res){
    Owl.remove({_id: req.params.id}, function(err){
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});