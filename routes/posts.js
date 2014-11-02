// Mounted on localhost:3000/posts/

var express = require('express');
var router = express.Router();

// Index
router.get('/', function (req, res){
	res.render('../views/posts/index', { title: 'List of posts'} );
});

// List of posts
router.get('/list', function (req, res) {
	res.render('../views/posts/post-list');
});

// Error with post
router.get('/404', function (req, res) {
	res.render('../views/posts/post-error');
});

// Specific post with comments
router.get('/post/:id', function (req, res) {
	res.render('../views/posts/post-read', { id: req.params.id});
});

// Angular Templates
router.get('/post-template', function (req, res){
	res.render('../views/posts/post-template');
});

module.exports = router;