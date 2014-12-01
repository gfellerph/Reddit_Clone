// MOUNTED ON '/api/...'
// Return router
module.exports = function (io) {

	var express 	= require('express');
	var router 		= express.Router();
	var posts 		= require('../controllers/posts');
	var comments 	= require('../controllers/comments');
	var users		= require('../controllers/users');
	var auth 		= require('../controllers/auth');

	// Posts API
	router.get('/posts', posts.list, function (req, res) {res.json(req.posts); });
	router.get('/post/:id', posts.read, function (req, res) {res.json(req.post); });
	router.post('/post', auth.allowed, posts.create, function (req, res) { broadcast('post.new', req.post);res.json(req.post); });
	router.put('/post/:id', auth.allowed, posts.update, function (req, res) { res.json(req.post); });
	router.put('/post/:id/upvote', auth.allowed, posts.read, posts.upvote, posts.update, function (req, res) {broadcast('post.vote', req.body); res.json(req.body); });
	router.put('/post/:id/downvote', auth.allowed, posts.read, posts.downvote, posts.update, function (req, res) {broadcast('post.vote', req.body); res.json(req.body); });
	router.delete('/post/:id', posts.read, posts.delete, function (req, res) { broadcast('post.delete', req.post); res.json({deletion: 'complete'}); });
	router.delete('/post/:id/upvote', auth.allowed, posts.read, posts.deleteVote, posts.update, function (req, res) { res.json(req.body); });
	router.delete('/post/:id/downvote', auth.allowed, posts.read, posts.deleteVote, posts.update, function (req, res) { res.json(req.body); });

	// Comments API
	router.get('/comments/to/:id', comments.list, function (req, res) {res.json(req.comments);});
	router.get('/comment/:id', comments.read, function (req, res) {res.json(req.comment);});
	router.post('/comment/to/:id', auth.allowed, comments.create, function (req, res) {broadcast('comment.new', req.comment); res.json(req.comment); });
	router.put('/comment/:id', auth.allowed, comments.update, function (req, res) {res.json(req.comment); });
	router.put('/comment/:id/upvote', auth.allowed, comments.read, comments.upvote, comments.update, function (req, res) {broadcast('comment.vote', req.body); res.json(req.body); });
	router.put('/comment/:id/downvote', auth.allowed, comments.read, comments.downvote, comments.update, function (req, res) {broadcast('comment.vote', req.body); res.json(req.body); });
	router.delete('/comment/:id', comments.read, comments.delete, function (req, res) {broadcast('comment.delete', req.comment); res.json({deletion: 'complete'}); });
	router.delete('/comment/:id/upvote', auth.allowed, comments.read, comments.deleteVote, comments.update, function (req, res) {res.json(req.body); });
	router.delete('/comment/:id/downvote', auth.allowed, comments.read, comments.deleteVote, comments.update, function (req, res) {res.json(req.body); });

	// Auth API
	router.get('/user', users.getUser);
	router.get('/user/:id', users.getUserById, function (req, res) { res.json(req.userById); });

	// Profile API
	router.get('/posts/from/user/:id', posts.listByUser, function (req, res) { res.json(req.posts); });
	router.get('/comments/from/user/:id', comments.listByUser, function (req, res) { res.json(req.comments); });
	
	// Helper function
	function broadcast (eventName, data) {
		io.sockets.emit(eventName, data);
	}

	return router;
};