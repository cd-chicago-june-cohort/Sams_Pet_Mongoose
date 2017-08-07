var express = require("express");
var app = express();
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema({
    poster: String,
    content: String,
    posted_at: Date
});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote')


app.get('/', function(req, res) {
    res.render("index");
});

app.post('/new_quote', function(req,res){
    var myDate = new Date();
    var newQuote = new Quote();
    newQuote.poster = req.body.name;
    newQuote.content = req.body.content;
    newQuote.posted_at = myDate;
    newQuote.save(function(err){
        if(err){
            console.log('There has been an error with your quote post!');
            res.redirect("/");
        }else{
            res.redirect("/quotes");
        }
    })
});

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes){
        if (err){
            console.log("There has been an error loading quotes");
            res.redirect("/");
        } else {
            res.render("landing", {quotes: quotes});
        }
    });
});


app.listen(8000, function() {
    console.log("listening on port 8000");
});