// Mounted on localhost:3000/posts/

var express = require('express');
var router = express.Router();

// Index
router.get('/', function (req, res){
	res.render('../views/posts/index', { title: 'List of posts'} );
});

// List of posts
router.get('/list', function (req, res) {
	console.log('User login state:');
	console.log(req.isAuthenticated());
	console.log(req.user);
	res.render('../views/posts/post-list', {user: req.user, loggedIn: req.isAuthenticated()});
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

router.get('/post-detail', function (req, res) {
	res.render('../views/posts/post-detail');
});

router.get('/post-form', isLoggedIn, function (req, res) {
	res.render('../views/posts/post-form');
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.render('../views/auth/login');
}