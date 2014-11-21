// MOUNTED ON '/api/...'

var express 	= require('express');
var router 		= express.Router();
var posts 		= require('../controllers/posts');
var comments 	= require('../controllers/comments');
var users		= require('../controllers/users');
var auth 		= require('../controllers/auth');

// Posts API
router.get('/posts', posts.list, function (req, res) {res.json(req.posts); });
router.get('/post/:id', posts.read, function (req, res) {res.json(req.post); });
router.post('/post', auth.allowed, posts.create, function (req, res) { res.json(req.post); });
router.put('/post/:id', auth.allowed, posts.update, function (req, res) { res.json(req.post); });
router.put('/post/:id/upvote', auth.allowed, posts.read, posts.upvote, posts.update, function (req, res) { res.json(req.post); });
router.put('/post/:id/downvote', posts.downvote);
router.delete('/post/:id', posts.delete, function (req, res) { res.json({deletion: 'complete'}); });

// Comments API
router.get('/comments/to/:id', comments.list);
router.get('/comment/:id', comments.read);
router.post('/comment', comments.create);
router.put('/comment/:id', comments.update);
router.put('/comment/:id/upvote', comments.upvote);
router.put('/comment/:id/downvote', comments.downvote);
router.delete('/comment/:id', comments.delete);

// Auth API
router.get('/user', users.getUser);

// Return router
module.exports = router;