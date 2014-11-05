// MOUNTED ON '/api/...'

var express 	= require('express');
var router 		= express.Router();
var posts 		= require('../controllers/posts');
var comments 	= require('../controllers/comments');

// Posts API
router.get('/posts', posts.list);
router.get('/post/:id', posts.read);
router.post('/post', posts.create);
router.put('/post/:id', posts.update);
router.put('/post/:id/upvote', posts.upvote);
router.put('/post/:id/downvote', posts.downvote);
router.delete('/post/:id', posts.delete);

// Comments API
router.get('/comments/to/:id', comments.list);
router.get('/comment/:id', comments.read);
router.post('/comment', comments.create);
router.put('/comment/:id', comments.update);
router.put('/comment/:id/upvote', comments.upvote);
router.put('/comment/:id/downvote', comments.downvote);
router.delete('/comment/:id', comments.delete);

// Return router
module.exports = router;