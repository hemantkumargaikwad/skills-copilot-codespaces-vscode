// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Create an express app
const app = express();

// Enable cross origin resource sharing
app.use(cors());

// Enable body parser to parse JSON
app.use(bodyParser.json());

// Enable morgan for logging
app.use(morgan('combined'));

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments');
const db = mongoose.connection;

// Create post schema
const PostSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Post = mongoose.model('Post', PostSchema);

// Create comment schema
const CommentSchema = new mongoose.Schema({
    content: String,
    postId: String
});
const Comment = mongoose.model('Comment', CommentSchema);

// Get all posts
app.get('/posts', (req, res) => {
    Post.find({}, 'title content', (err, posts) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                posts: posts
            });
        }
    }).sort({
        _id: -1
    });
});

// Get single post
app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, 'title content', (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.send(post);
        }
    });
});

// Add new post
app.post('/posts', (req, res) => {
    const db = req.db;
    const title = req.body.title;
    const content = req.body.content;
    const newPost = new Post({
        title: title,
        content: content
    });

    newPost.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                success: true,
                message: 'Post saved successfully!'
            });
        }
    });
});

// Update post
app.put('/posts/:id', (req, res) => {
    const db = req.db;
    Post.findById(req.params.id, 'title content', (err, post) => {
        if (err) {
            console.log(err);
        } else {
            post.title = req.body.title;
            post.content = req.body.content;
            post.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({
                        success: true
                    });
                }
            });
        }
    });
});

// Delete post
app.delete('/posts/:id', (req, res) => {
    const db = req.db;
    Post.remove({
        _id: req.params.id
    }, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Add new comment
app.post('/comments', (req, res) => {
    const db = req.db;
    const content = req.body.content;
    const postId = req.body.postId;
    const newComment = new Comment({
        content: content,
        postId: postId
    });

    newComment.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                success: true,
                message: 'Comment saved successfully!'
            });
        }
    });
});

// Get comments by post id
app.get('/comments/:postId', (req, res) => {
    Comment.find({
        postId: req.params.postId
    }, 'content', (err, comments) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                comments: comments
            });
        }
    });
});

// Start server
app.listen(process.env.PORT || 8081);