// MOUNTED ON '/api/...'

var express 	= require('express');
var router 		= express.Router();
var posts 		= require('../controllers/posts');
var comments 	= require('../controllers/comments');
var users		= require('../controllers/users');
var auth 		= require('../controllers/auth');

// Posts API
// Use middleware to authenticate request and handle response
router.get('/posts', posts.list, function (req, res) {res.json(req.posts); });
router.get('/post/:id', posts.read, function (req, res) {res.json(req.post); });
router.post('/post', auth.allowed, posts.create, function (req, res) { res.json(req.post); });
router.put('/post/:id', auth.allowed, posts.update, function (req, res) { res.json(req.post); });
router.put('/post/:id/upvote', auth.allowed, posts.read, posts.upvote, posts.update, function (req, res) { res.json(req.body); });
router.put('/post/:id/downvote', auth.allowed, posts.read, posts.downvote, posts.update, function (req, res) { res.json(req.body); });
router.delete('/post/:id', posts.delete, function (req, res) { res.json({deletion: 'complete'}); });
router.delete('/post/:id/upvote', auth.allowed, posts.read, posts.deleteVote, posts.update, function (req, res) { res.json(req.body); });
router.delete('/post/:id/downvote', auth.allowed, posts.read, posts.deleteVote, posts.update, function (req, res) { res.json(req.body); });

// Comments API
router.get('/comments/to/:id', comments.list, function (req, res) {res.json(req.comments);});
router.get('/comment/:id', comments.read, function (req, res) {res.json(req.comment);});
router.post('/comment/to/:id', auth.allowed, comments.create, function (req, res) {res.json(req.comment); });
router.put('/comment/:id', auth.allowed, comments.update, function (req, res) {res.json(req.comment); });
router.put('/comment/:id/upvote', auth.allowed, comments.read, comments.upvote, comments.update, function (req, res) {res.json(req.comment); });
router.put('/comment/:id/downvote', auth.allowed, comments.read, comments.downvote, comments.update, function (req, res) {res.json(req.comment); });
router.delete('/comment/:id', comments.delete, function (req, res) { res.json({deletion: 'complete'}); });
router.delete('/comment/:id/upvote', auth.allowed, comments.read, comments.deleteVote, comments.update, function (req, res) {res.json(req.comment); });
router.delete('/comment/:id/downvote', auth.allowed, comments.read, comments.deleteVote, comments.update, function (req, res) {res.json(req.comment); });

// Auth API
router.get('/user', users.getUser);

// Return router
module.exports = router;