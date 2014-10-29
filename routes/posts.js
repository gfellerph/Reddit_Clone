var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts');

// Index
router.get('/', function (req, res){
	res.render('../views/posts/index', { title: 'Posts'});
});

// Specific post with comments
router.get('/post/:id', function (req, res) {
	console.log('Post id: ', req.params.id);
	res.render('../views/posts/post', { id: req.params.id});
});

// Angular Templates
router.get('/post-template', function (req, res){
	res.render('../views/posts/post-template');
});

module.exports = router;