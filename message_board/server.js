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


var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
    poster: String,
    content: String,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    created_at: Date
});
mongoose.model('Post', PostSchema);
var Post = mongoose.model('Post');

var CommentSchema = new mongoose.Schema({
    comment_poster: String,
    comment_content: String,
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    created_at: Date
});
mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');

app.get('/', function(req,res){

    Post.find({}).sort('-created_at').populate('comments').exec( function(err,posts){

        if (err){
            console.log(err);
            res.render("index", {posts: []});
        } else {
            console.log(posts);
            console.log(posts[0].comments[0].comment_content)
            res.render("index", {posts: posts});
        }
    });
});

app.post('/post', function(req,res){
    var message = new Post();
    var myDate = new Date();
    message.poster = req.body.name;
    message.content = req.body.post;
    message.comments = [];
    message.save(function(err){
        if (err) {
            console.log(err);
            res.redirect('/');
        } else{
            res.redirect('/');
        }
    });
});

app.post('/comment/:id', function(req,res){
    Post.findOne({_id: req.params.id}, function(err, post){
        var comment = new Comment();
        var myDate = new Date();
        comment.comment_poster = req.body.name;
        comment.comment_content = req.body.comment;
        comment.created_at = myDate;
        comment._post = post._id;
        console.log('1. ----------');
        comment.save(function(err){
            console.log('2. ----------');
            post.comments.push(comment);
            post.save(function (err){
                if(err){
                    console.log('3. ----------');
                    console.log("there was an error: " + err);
                    res.redirect('/');
                } else {
                    console.log('4. ----------');
                    res.redirect('/');
                }
            });
        });
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});